import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = parseInt(process.env.PORT, 10) || 7001;

  const corsOption = {
    origin: true,
    credentials: true,
  };

  app.enableCors(corsOption);

  await app.listen(port, async () => {
    console.info(`Carefinder'nfly server listening on : ${await app.getUrl()}`);
  });
}
bootstrap();
