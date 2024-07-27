import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from '../../domain/task/task.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { NewTaskRequest } from './task.request.dto';
import { createRandomNewTask, createRandomTask } from '../../domain/task/task.entity.spec';
import { TaskResponse } from './task.response.dto';

describe('TaskController', () => {
  let taskService: DeepMocked<TaskService>;
  let controller: TaskController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [{
        provide: TaskService,
        useValue: createMock<TaskService>(),
      }],
    }).compile();

    controller = app.get(TaskController);
    taskService = app.get(TaskService);
  });

  describe('create', () => {

    it('should accept a valid task', async () => {
      // Prepare
      const new_task = createRandomNewTask();
      const expected_task = createRandomTask(new_task.data);
      taskService.create.mockReturnValue(Promise.resolve(expected_task));

      const request = NewTaskRequest.fromDomain(new_task);

      // Execute
      const result = controller.createTask(request);

      // Verify
      await expect(result).resolves.toStrictEqual(TaskResponse.fromDomain(expected_task));
    });

  });
});

