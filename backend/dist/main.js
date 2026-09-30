import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        instrument: ObserveInstrument
    });
    const config = app.get(ConfigService);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.enableCors({ origin: config.getOrThrow('ORIGEN_CLIENTE') });
    await app.listen(Number(config.get('PUERTO', 3000)));
}
await bootstrap();
//# sourceMappingURL=main.js.map