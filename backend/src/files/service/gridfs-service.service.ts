import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { Connection } from 'mongoose';

@Injectable()
export class GridFsService {
    private bucket?: mongoose.mongo.GridFSBucket;

    constructor(@InjectConnection() private readonly connection: mongoose.Connection) { }

    private get buckets() {
        this.bucket ??= new mongoose.mongo.GridFSBucket(this.connection.db!, { bucketName: 'file_contents' });
        return this.bucket;
    }

    upload(buffer: Buffer, filename: string, mimeType: string): Promise<mongoose.Types.ObjectId> {
        return new Promise((resolve, reject) => {
            const stream = this.buckets.openUploadStream(filename, { metadata: { mimeType } });
            stream.on('finish', () => resolve(stream.id as mongoose.Types.ObjectId));
            stream.on('error', reject);
            stream.end(buffer);
        });
    }

    download(id: mongoose.Types.ObjectId) {
        return this.buckets.openDownloadStream(id);
    }

    async remove(id: mongoose.Types.ObjectId) {
        try {
            await this.buckets.delete(id);
        } catch {
           console.log('no entrooooo')
        }
    }
}