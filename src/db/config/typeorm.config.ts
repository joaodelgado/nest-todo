import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

export const typeorm: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'todo.db',
  migrations: [__dirname + '/../migrations/*.js'],
  autoLoadEntities: true,
};

// Datasource used to run migrations
export const datasource = new DataSource(typeorm as DataSourceOptions);
