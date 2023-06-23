import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { dbConfiguration } from 'src/utils/config';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  username: dbConfiguration.DatabaseUser,
  password: 'tylerjusfly1996',
  port: 5432,
  host: 'localhost',
  database: dbConfiguration.DatabaseName,
  // ssl: {
  //   require: true,
  //   rejectUnauthorized: false,
  // },
  synchronize: true, // do not for to turn to false in production
  autoLoadEntities: true,
  entities: [__dirname + 'src/**/*.entity{ .ts,.js}'],
  migrations: [__dirname + '/**/'],
};