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
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
let GridFsService = class GridFsService {
    connection;
    bucket;
    constructor(connection) {
        this.connection = connection;
    }
    get buckets() {
        this.bucket ??= new mongoose.mongo.GridFSBucket(this.connection.db, { bucketName: 'file_contents' });
        return this.bucket;
    }
    upload(buffer, filename, mimeType) {
        return new Promise((resolve, reject) => {
            const stream = this.buckets.openUploadStream(filename, { metadata: { mimeType } });
            stream.on('finish', () => resolve(stream.id));
            stream.on('error', reject);
            stream.end(buffer);
        });
    }
    download(id) {
        return this.buckets.openDownloadStream(id);
    }
    async remove(id) {
        try {
            await this.buckets.delete(id);
        }
        catch {
            console.log('no entrooooo');
        }
    }
};
GridFsService = __decorate([
    Injectable(),
    __param(0, InjectConnection()),
    __metadata("design:paramtypes", [mongoose.Connection])
], GridFsService);
export { GridFsService };
//# sourceMappingURL=gridfs-service.service.js.map