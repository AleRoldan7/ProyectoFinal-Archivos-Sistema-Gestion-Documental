import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FileComment, FileCommentDocument } from '../schemas/comment.schema.js';
import { FileEntry, FileEntryDocument } from '../schemas/file.schema.js';
import { AccessService } from '../../sharing/service/access.service.js';
import { ActivityService } from '../../activity/service/activity.service.js';
import { ActionActivity } from '../../common/enums/action-activity.enum.js';
import { Permission, ResourceType } from '../../common/enums/shraing.enum.js';

@Injectable()
export class CommentService {
    constructor(
        @InjectModel(FileComment.name) private readonly commentModel: Model<FileCommentDocument>,
        @InjectModel(FileEntry.name) private readonly fileModel: Model<FileEntryDocument>,
        private readonly access: AccessService,
        private readonly activity: ActivityService,
    ) { }

    private async getFile(fileId: string) {
        const file = await this.fileModel.findOne({ _id: fileId, deletedAt: null }).select('name ownerId');
        if (!file) throw new NotFoundException('Archivo no encontrado');
        return file;
    }

    private toView(
        c: { _id: Types.ObjectId; text: string; createdAt?: Date; authorId: unknown },
        userId: string,
        ownerId: string,
    ) {
        const autor = c.authorId as { _id: Types.ObjectId; firstName?: string; lastName?: string } | Types.ObjectId;
        const esSoloId = autor instanceof Types.ObjectId;
        const autorId = esSoloId ? autor.toString() : String(autor._id);
        return {
            _id: c._id.toString(),
            text: c.text,
            createdAt: c.createdAt,
            author: {
                _id: autorId,
                firstName: esSoloId ? '' : (autor.firstName ?? ''),
                lastName: esSoloId ? '' : (autor.lastName ?? ''),
            },
            // El autor puede borrar su comentario; el propietario del archivo puede borrar cualquiera
            puedeEliminar: autorId === userId || ownerId === userId,
        };
    }

    async list(userId: string, fileId: string) {
        await this.access.require(userId, ResourceType.FILE, fileId, Permission.READ);
        const file = await this.getFile(fileId);
        const comentarios = await this.commentModel.find({ fileId })
            .sort({ createdAt: 1 })
            .populate('authorId', 'firstName lastName')
            .lean();
        return comentarios.map((c) => this.toView(c, userId, file.ownerId.toString()));
    }

    async create(userId: string, fileId: string, text: string) {
        await this.access.require(userId, ResourceType.FILE, fileId, Permission.COMMENT);
        const file = await this.getFile(fileId);

        const creado = await this.commentModel.create({ fileId, authorId: userId, text });
        await creado.populate('authorId', 'firstName lastName');
        await this.activity.register(userId, ActionActivity.ADD_COMMENT, 'FILE', fileId, file.name);

        return this.toView(creado.toObject(), userId, file.ownerId.toString());
    }

    async remove(userId: string, fileId: string, commentId: string) {
        await this.access.require(userId, ResourceType.FILE, fileId, Permission.READ);
        const file = await this.getFile(fileId);

        const comentario = await this.commentModel.findOne({ _id: commentId, fileId });
        if (!comentario) throw new NotFoundException('Comentario no encontrado');

        const puede = comentario.authorId.toString() === userId || file.ownerId.toString() === userId;
        if (!puede) throw new ForbiddenException('Solo puedes eliminar tus propios comentarios');

        await comentario.deleteOne();
        await this.activity.register(userId, ActionActivity.DELETE_COMMENT, 'FILE', fileId, file.name);
    }
}
