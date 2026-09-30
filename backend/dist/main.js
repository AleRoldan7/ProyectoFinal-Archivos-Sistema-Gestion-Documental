import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        instrument: ObserveInstrument
    });
    const config = app.get(ConfigService);
    const configApi = new DocumentBuilder()
        .setTitle('Proyecto Final API')
        .setDescription('API del Proyecto Final')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, configApi);
    SwaggerModule.setup('api', app, documentFactory);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.enableCors({ origin: config.getOrThrow('ORIGEN_CLIENTE') });
    await app.listen(Number(config.get('PUERTO', 3000)));
}
await bootstrap();
//# sourceMappingURL=main.js.map