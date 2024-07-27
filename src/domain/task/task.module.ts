import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDbModule } from '../../db/task/task.module';

@Module({
  // TODO can this dependency be removed and resolved by the main AppModule instead?
  imports: [TaskDbModule],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskDomainModule { }
