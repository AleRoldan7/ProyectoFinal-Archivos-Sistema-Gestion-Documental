import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { extname } from 'node:path';
import { FileEntry, FileEntryDocument } from '../schemas/file.schema.js';
import { GridFsService } from './gridfs-service.service.js';
import { FolderService } from '../../folders/service/folder-service.service.js';
import { ALLOWED_EXTENSIONS, FileType, MIME_BY_TYPE } from '../../common/enums/files.enum.js';
import { ListFileQueryDTO } from '../dto/list-file-query.dto.js';


@Injectable()
export class FileService {
    constructor(@InjectModel(FileEntry.name) private readonly fileModel: Model<FileEntryDocument>, private readonly gridFs: GridFsService,
        private readonly folders: FolderService) { }

    static decodeName(originalname: string) {
        return Buffer.from(originalname, 'latin1').toString('utf8').trim();
    }

    private validateUpload(file: Express.Multer.File | undefined) {
        if (!file) throw new BadRequestException('Debes enviar un archivo en el campo "file"');
        const name = FileService.decodeName(file.originalname);
        const ext = extname(name).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            throw new BadRequestException('Solo se permiten archivos .txt y .md');
        }
        if (file.buffer.includes(0)) {
            throw new BadRequestException('El contenido no es texto válido');
        }
        return { name, fileType: ext === '.md' ? FileType.MD : FileType.TXT };
    }

    async getOwned(ownerId?: string, id?: string) {
        const file = await this.fileModel.findOne({ _id: id, ownerId, deletedAt: null });
        if (!file) throw new NotFoundException('Archivo no encontrado');
        return file;
    }

    private async assertNameFree(
        ownerId: string, folderId: mongoose.Types.ObjectId | null, name: string, excludeId?: string,
    ) {
        const filter: Record<string, unknown> = { ownerId, folderId, name, deletedAt: null };
        if (excludeId) filter._id = { $ne: excludeId };
        if (await this.fileModel.exists(filter)) {
            throw new ConflictException('Ya existe un archivo con ese nombre en esta ubicación');
        }
    }

    async upload(ownerId: string, folderId: string | undefined, file: Express.Multer.File | undefined) {
        const { name, fileType } = this.validateUpload(file);
        const folder = folderId ? await this.folders.getOwned(ownerId, folderId) : null;

        await this.assertNameFree(ownerId, folder?._id ?? null, name);

        const gridFsId = await this.gridFs.upload(file!.buffer, name, MIME_BY_TYPE[fileType]);
        try {
            return await this.fileModel.create({
                ownerId, folderId: folder?._id ?? null, name, fileType,
                mimeType: MIME_BY_TYPE[fileType], size: file!.size, gridFsId,
            });
        } catch (e) {
            await this.gridFs.remove(gridFsId);
            throw e;
        }
    }

    findById(id: string) {
        return this.fileModel.findOne({ _id: id, deletedAt: null });
    }

    async list(ownerId: string, listFileQueryDto: ListFileQueryDTO) {
        const filter: Record<string, any> = { ownerId, deletedAt: null };

        if (listFileQueryDto.folderId === 'root') filter.folderId = null;
        else if (listFileQueryDto.folderId) {
            await this.folders.getOwned(ownerId, listFileQueryDto.folderId);
            filter.folderId = listFileQueryDto.folderId;
        }

        if (listFileQueryDto.type) filter.fileType = listFileQueryDto.type;
        if (listFileQueryDto.search) {
            const escaped = listFileQueryDto.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            filter.name = { $regex: escaped, $options: 'i' };
        }
        if (listFileQueryDto.from || listFileQueryDto.to) {
            filter.createdAt = {};
            if (listFileQueryDto.from) filter.createdAt.$gte = new Date(listFileQueryDto.from);
            if (listFileQueryDto.to) {
                const to = new Date(listFileQueryDto.to);
                if (listFileQueryDto.to.length === 10) to.setUTCHours(23, 59, 59, 999);
                filter.createdAt.$lte = to;
            }
        }

        const page = listFileQueryDto.page ?? 1;
        const limit = listFileQueryDto.limit ?? 20;
        const sort: Record<string, 1 | -1> = { [listFileQueryDto.sortBy ?? 'createdAt']: listFileQueryDto.order === 'asc' ? 1 : -1 };

        const [items, total] = await Promise.all([
            this.fileModel.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
            this.fileModel.countDocuments(filter),
        ]);
        return { items, total, page, limit };
    }

    async download(ownerId: string, id: string) {
        const file = await this.getOwned(ownerId, id);
        return { file, stream: this.gridFs.download(file.gridFsId) };
    }

    async replaceContent(id: string, upload: Express.Multer.File | undefined) {
        const file = await this.getOwned(id);
        this.validateUpload(upload);

        const newId = await this.gridFs.upload(upload!.buffer, file.name, file.mimeType);
        const oldId = file.gridFsId;
        try {
            file.gridFsId = newId;
            file.size = upload!.size;
            await file.save();
        } catch (e) {
            await this.gridFs.remove(newId);
            throw e;
        }
        await this.gridFs.remove(oldId);
        return file;
    }

    async rename(ownerId: string, id: string, newName: string) {
        const file = await this.getOwned(ownerId, id);
        const name = newName.trim();
        if (extname(name).toLowerCase() !== `.${file.fileType}`) {
            throw new BadRequestException(`El nombre debe conservar la extensión .${file.fileType}`);
        }
        await this.assertNameFree(ownerId, file.folderId, name, id);
        file.name = name;
        return file.save();
    }

    async move(ownerId: string, id: string, folderId: string | null) {
        const file = await this.getOwned(ownerId, id);
        const dest = folderId ? await this.folders.getOwned(ownerId, folderId) : null;

        if ((file.folderId?.toString() ?? null) === (dest?._id.toString() ?? null)) return file;

        await this.assertNameFree(ownerId, dest?._id ?? null, file.name, id);
        file.folderId = dest?._id ?? null;
        return file.save();
    }
}