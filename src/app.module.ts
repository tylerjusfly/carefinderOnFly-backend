import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './database/orm.config';
import { HospitalModule } from './modules/hospital/hospital.module';
import { MailModule } from './modules/mail/mail.module';
import { ApiKeyUser } from './apikey.entity';
import { ValidateApiKeyMiddleware } from './middlewares/validateApiKey';

@Module({
  imports: [HospitalModule, TypeOrmModule.forRoot(databaseConfig), MailModule, TypeOrmModule.forFeature([ApiKeyUser])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ValidateApiKeyMiddleware).forRoutes(
      // { path: 'developer/apikey', method: RequestMethod.POST },
      { path: 'hospital/list', method: RequestMethod.GET },
    );
  }
}

// { path: 'trees', method: RequestMethod.POST }
