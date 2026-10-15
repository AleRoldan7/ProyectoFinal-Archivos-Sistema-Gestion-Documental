import { Module } from "@nestjs/common";
import { FolderModule } from "../../folders/module/folder.module.js";
import { FileModule } from "../../files/module/file.module.js";
import { TrashController } from "../controller/trash.controller.js";
import { TrashService } from "../service/trash.service.js";

@Module({
    imports: [FolderModule, FileModule],
    controllers: [TrashController],
    providers: [TrashService],
})
export class TrashModule {}