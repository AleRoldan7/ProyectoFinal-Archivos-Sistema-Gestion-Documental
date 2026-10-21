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
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Folder } from '../schemas/folder.schema.js';
import { Permission, ResourceType } from '../../common/enums/shraing.enum.js';
import { AccessService } from '../../sharing/service/access.service.js';
let FolderService = class FolderService {
    folderModel;
    access;
    constructor(folderModel, access) {
        this.folderModel = folderModel;
        this.access = access;
    }
    async getOwned(ownerId, id) {
        const folder = await this.folderModel.findOne({ _id: id, ownerId, deletedAt: null });
        if (!folder)
            throw new NotFoundException('Carpeta no encontrada');
        return folder;
    }
    async assertNameFree(ownerId, parentId, name, excludeId) {
        const filter = { ownerId, parentId, name, deletedAt: null };
        if (excludeId)
            filter._id = { $ne: excludeId };
        if (await this.folderModel.exists(filter)) {
            throw new ConflictException('Ya existe una carpeta con ese nombre en esta ubicación');
        }
    }
    async create(ownerId, dto) {
        const name = dto.name.trim();
        let parent = null;
        if (dto.parentId) {
            await this.access.require(ownerId, ResourceType.FOLDER, dto.parentId, Permission.EDIT);
            parent = await this.folderModel.findOne({ _id: dto.parentId, deletedAt: null });
            if (!parent)
                throw new NotFoundException('Carpeta padre no encontrada');
        }
        await this.assertNameFree(ownerId, parent?._id ?? null, name);
        return this.folderModel.create({
            ownerId,
            name,
            parentId: parent?._id ?? null,
            ancestors: parent ? [...parent.ancestors, parent._id] : [],
        });
    }
    async findChildren(ownerId, parentId) {
        const filter = { deletedAt: null };
        if (parentId) {
            await this.access.require(ownerId, ResourceType.FOLDER, parentId, Permission.READ);
            filter.parentId = parentId;
        }
        else {
            filter.ownerId = ownerId;
            filter.parentId = null;
        }
        return this.folderModel.find(filter).sort({ name: 1 });
    }
    async getWithPath(ownerId, id) {
        await this.access.require(ownerId, ResourceType.FOLDER, id, Permission.READ);
        const folder = await this.folderModel.findOne({ _id: id, deletedAt: null });
        if (!folder)
            throw new NotFoundException('Carpeta no encontrada');
        const docs = await this.folderModel
            .find({ _id: { $in: folder.ancestors } })
            .select('name');
        const byId = new Map(docs.map((d) => [d.id, d.name]));
        const path = folder.ancestors.map((a) => ({ _id: a, name: byId.get(a.toString()) }));
        return { folder, path };
    }
    async rename(ownerId, id, newName) {
        const folder = await this.getOwned(ownerId, id);
        const name = newName.trim();
        await this.assertNameFree(ownerId, folder.parentId, name, id);
        folder.name = name;
        return folder.save();
    }
    async move(ownerId, id, newParentId) {
        const folder = await this.getOwned(ownerId, id);
        let dest = null;
        if (newParentId) {
            await this.access.require(ownerId, ResourceType.FOLDER, newParentId, Permission.EDIT);
            dest = await this.folderModel.findOne({ _id: newParentId, deletedAt: null });
            if (!dest)
                throw new NotFoundException('Carpeta destino no encontrada');
            const intoItself = dest._id.equals(folder._id);
            const intoDescendant = dest.ancestors.some((a) => a.equals(folder._id));
            if (intoItself || intoDescendant) {
                throw new BadRequestException('No se puede mover una carpeta dentro de sí misma o de sus subcarpetas');
            }
        }
        const currentParent = folder.parentId?.toString() ?? null;
        if (currentParent === (dest?._id.toString() ?? null))
            return folder;
        await this.assertNameFree(ownerId, dest?._id ?? null, folder.name, id);
        const newPrefix = dest ? [...dest.ancestors, dest._id] : [];
        await this.folderModel.updateMany({ ancestors: folder._id }, [{
                $set: {
                    ancestors: {
                        $concatArrays: [
                            newPrefix,
                            { $slice: ['$ancestors', { $indexOfArray: ['$ancestors', folder._id] }, 10000] },
                        ],
                    },
                },
            }]);
        folder.parentId = dest?._id ?? null;
        folder.ancestors = newPrefix;
        return folder.save();
    }
    findById(id) {
        return this.folderModel.findOne({ _id: id, deletedAt: null });
    }
};
FolderService = __decorate([
    Injectable(),
    __param(0, InjectModel(Folder.name)),
    __metadata("design:paramtypes", [Model, AccessService])
], FolderService);
export { FolderService };
//# sourceMappingURL=folder-service.service.js.map