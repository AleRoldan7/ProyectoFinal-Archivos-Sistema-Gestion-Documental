var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/module/user.module.js';
import { AuthModule } from './auth/module/auth.module.js';
import { FolderModule } from './folders/module/folder.module.js';
import { FileModule } from './files/module/file.module.js';
import { ActivityModule } from './activity/module/activity.module.js';
import { ReportsModule } from './report/module/reports.module.js';
import { SharingModule } from './sharing/module/sharing.module.js';
import { TrashModule } from './trash/module/trash.module.js';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { RolesGuard } from './common/guards/roles.guard.js';
export const { ObserveModule, ObserveInstrument } = createObserveModule();
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
            ConfigModule.forRoot({ isGlobal: true }),
            MongooseModule.forRootAsync({
                inject: [ConfigService],
                useFactory: (config) => ({
                    uri: config.getOrThrow('MONGO_URI'),
                }),
            }),
            UserModule,
            AuthModule,
            FolderModule,
            FileModule,
            ActivityModule,
            ReportsModule,
            SharingModule,
            TrashModule,
            ObserveModule.forRoot({
                appKey: 'YOUR_APP_KEY',
                appSecret: 'YOUR_APP_SECRET',
                serviceId: 'backend',
            }),
        ],
        controllers: [AppController],
        providers: [AppService,
            { provide: APP_GUARD, useClass: JwtAuthGuard },
            { provide: APP_GUARD, useClass: RolesGuard },
        ],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map