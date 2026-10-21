import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { inject } from 'vitest';
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

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGO_URI'),
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
export class AppModule { }
