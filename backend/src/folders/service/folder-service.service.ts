import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Folder, FolderDocument } from '../schemas/folder.schema.js';
import { CreateFolderDTO } from '../dto/create-folder.dto.js';
import { Permission, ResourceType } from '../../common/enums/shraing.enum.js';
import { AccessService } from '../../sharing/service/access.service.js';

@Injectable()
export class FolderService {
    constructor(
        @InjectModel(Folder.name) private readonly folderModel: Model<FolderDocument>, private readonly access: AccessService) { }

    async getOwned(ownerId: string, id: string): Promise<FolderDocument> {
        const folder = await this.folderModel.findOne({ _id: id, ownerId, deletedAt: null });
        if (!folder) throw new NotFoundException('Carpeta no encontrada');
        return folder;
    }

    private async assertNameFree(
        ownerId: string, parentId: mongoose.Types.ObjectId | null, name: string, excludeId?: string,
    ) {
        const filter: Record<string, unknown> = { ownerId, parentId, name, deletedAt: null };
        if (excludeId) filter._id = { $ne: excludeId };
        if (await this.folderModel.exists(filter)) {
            throw new ConflictException('Ya existe una carpeta con ese nombre en esta ubicación');
        }
    }

    async create(ownerId: string, dto: CreateFolderDTO) {
        const name = dto.name.trim();
        let parent: FolderDocument | null = null;

        if (dto.parentId) {
            await this.access.require(ownerId, ResourceType.FOLDER, dto.parentId, Permission.EDIT);
            parent = await this.folderModel.findOne({ _id: dto.parentId, deletedAt: null });
            if (!parent) throw new NotFoundException('Carpeta padre no encontrada');
        }

        await this.assertNameFree(ownerId, parent?._id ?? null, name);

        return this.folderModel.create({
            ownerId,
            name,
            parentId: parent?._id ?? null,
            ancestors: parent ? [...parent.ancestors, parent._id] : [],
        });
    }

    async findChildren(ownerId: string, parentId?: string) {
        const filter: Record<string, any> = { deletedAt: null };

        if (parentId) {
            await this.access.require(ownerId, ResourceType.FOLDER, parentId, Permission.READ);
            filter.parentId = parentId;
        } else {
            filter.ownerId = ownerId;
            filter.parentId = null;
        }

        return this.folderModel.find(filter).sort({ name: 1 });
    }

    async getWithPath(ownerId: string, id: string) {
        await this.access.require(ownerId, ResourceType.FOLDER, id, Permission.READ);

        const folder = await this.folderModel.findOne({ _id: id, deletedAt: null });
        if (!folder) throw new NotFoundException('Carpeta no encontrada');

        const docs = await this.folderModel
            .find({ _id: { $in: folder.ancestors } })
            .select('name');
        const byId = new Map(docs.map((d) => [d.id, d.name]));
        const path = folder.ancestors.map((a) => ({ _id: a, name: byId.get(a.toString()) }));
        return { folder, path };
    }

    async rename(ownerId: string, id: string, newName: string) {
        const folder = await this.getOwned(ownerId, id);
        const name = newName.trim();
        await this.assertNameFree(ownerId, folder.parentId, name, id);
        folder.name = name;
        return folder.save();
    }

        async move(ownerId: string, id: string, newParentId: string | null) {
        const folder = await this.getOwned(ownerId, id);

        let dest: FolderDocument | null = null;
        if (newParentId) {
            dest = await this.getOwned(ownerId, newParentId);

            const intoItself = dest._id.equals(folder._id);
            const intoDescendant = dest.ancestors.some((a) => a.equals(folder._id));
            if (intoItself || intoDescendant) {
                throw new BadRequestException('No se puede mover una carpeta dentro de sí misma o de sus subcarpetas');
            }
        }

        const currentParent = folder.parentId?.toString() ?? null;
        if (currentParent === (dest?._id.toString() ?? null)) return folder; // sin cambios

        await this.assertNameFree(ownerId, dest?._id ?? null, folder.name, id);

        const newPrefix = dest ? [...dest.ancestors, dest._id] : [];

        await this.folderModel.updateMany(
            { ancestors: folder._id },
            [{
                $set: {
                    ancestors: {
                        $concatArrays: [
                            newPrefix,
                            { $slice: ['$ancestors', { $indexOfArray: ['$ancestors', folder._id] }, 10000] },
                        ],
                    },
                },
            }],
            { updatePipeline: true },
        );

        folder.parentId = dest?._id ?? null;
        folder.ancestors = newPrefix;
        return folder.save();
    }

    findById(id: string) {
        return this.folderModel.findOne({ _id: id, deletedAt: null });
    }
}