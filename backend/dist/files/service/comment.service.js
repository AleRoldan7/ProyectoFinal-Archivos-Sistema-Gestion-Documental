var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FileComment } from '../schemas/comment.schema.js';
import { FileEntry } from '../schemas/file.schema.js';
import { AccessService } from '../../sharing/service/access.service.js';
import { ActivityService } from '../../activity/service/activity.service.js';
import { ActionActivity } from '../../common/enums/action-activity.enum.js';
import { Permission, ResourceType } from '../../common/enums/shraing.enum.js';
let CommentService = class CommentService {
    commentModel;
    fileModel;
    access;
    activity;
    constructor(commentModel, fileModel, access, activity) {
        this.commentModel = commentModel;
        this.fileModel = fileModel;
        this.access = access;
        this.activity = activity;
    }
    async getFile(fileId) {
        const file = await this.fileModel.findOne({ _id: fileId, deletedAt: null }).select('name ownerId');
        if (!file)
            throw new NotFoundException('Archivo no encontrado');
        return file;
    }
    toView(c, userId, ownerId) {
        const autor = c.authorId;
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
            puedeEliminar: autorId === userId || ownerId === userId,
        };
    }
    async list(userId, fileId) {
        await this.access.require(userId, ResourceType.FILE, fileId, Permission.READ);
        const file = await this.getFile(fileId);
        const comentarios = await this.commentModel.find({ fileId })
            .sort({ createdAt: 1 })
            .populate('authorId', 'firstName lastName')
            .lean();
        return comentarios.map((c) => this.toView(c, userId, file.ownerId.toString()));
    }
    async create(userId, fileId, text) {
        await this.access.require(userId, ResourceType.FILE, fileId, Permission.COMMENT);
        const file = await this.getFile(fileId);
        const creado = await this.commentModel.create({ fileId, authorId: userId, text });
        await creado.populate('authorId', 'firstName lastName');
        await this.activity.register(userId, ActionActivity.ADD_COMMENT, 'FILE', fileId, file.name);
        return this.toView(creado.toObject(), userId, file.ownerId.toString());
    }
    async remove(userId, fileId, commentId) {
        await this.access.require(userId, ResourceType.FILE, fileId, Permission.READ);
        const file = await this.getFile(fileId);
        const comentario = await this.commentModel.findOne({ _id: commentId, fileId });
        if (!comentario)
            throw new NotFoundException('Comentario no encontrado');
        const puede = comentario.authorId.toString() === userId || file.ownerId.toString() === userId;
        if (!puede)
            throw new ForbiddenException('Solo puedes eliminar tus propios comentarios');
        await comentario.deleteOne();
        await this.activity.register(userId, ActionActivity.DELETE_COMMENT, 'FILE', fileId, file.name);
    }
};
CommentService = __decorate([
    Injectable(),
    __param(0, InjectModel(FileComment.name)),
    __param(1, InjectModel(FileEntry.name)),
    __metadata("design:paramtypes", [Model,
        Model,
        AccessService,
        ActivityService])
], CommentService);
export { CommentService };
//# sourceMappingURL=comment.service.js.map