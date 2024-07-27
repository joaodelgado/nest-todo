import { Module } from '@nestjs/common';
import { TaskDbModule } from './task/task.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeorm } from './config/typeorm.config';
import { UserDbModule } from './user/user.module';

const modules = [UserDbModule, TaskDbModule];

@Module({
  imports: [
    TypeOrmModule.forRoot(typeorm),
    ...modules,
  ],
  exports: modules,
})
export class DbModule { }

