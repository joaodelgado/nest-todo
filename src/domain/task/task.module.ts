import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDbModule } from '../../db/task/task.module';

@Module({
  imports: [TaskDbModule],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskDomainModule { }
