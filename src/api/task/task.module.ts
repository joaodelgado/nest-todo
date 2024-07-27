import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { DomainModule } from '../../domain/domain.module';

@Module({
  imports: [DomainModule],
  controllers: [TaskController],
})
export class TaskApiModule { }

