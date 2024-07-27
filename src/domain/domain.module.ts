import { Module } from '@nestjs/common';
import { TaskDomainModule } from './task/task.module';
import { UserDomainModule } from './user/user.module';

const modules = [UserDomainModule, TaskDomainModule];

@Module({
  imports: modules,
  exports: modules,
})
export class DomainModule { }
