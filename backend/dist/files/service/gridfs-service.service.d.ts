import mongoose from 'mongoose';
export declare class GridFsService {
    private readonly connection;
    private bucket?;
    constructor(connection: mongoose.Connection);
    private get buckets();
    upload(buffer: Buffer, filename: string, mimeType: string): Promise<mongoose.Types.ObjectId>;
    download(id: mongoose.Types.ObjectId): mongoose.mongo.GridFSBucketReadStream;
    remove(id: mongoose.Types.ObjectId): Promise<void>;
}
