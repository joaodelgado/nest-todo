import { Test } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { UnprocessableEntityException } from '@nestjs/common';
import { createRandomNewTask, createRandomTask } from './task.entity.spec';

describe('TaskService', () => {
  let taskRepository: DeepMocked<TaskRepository>;
  let service: TaskService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: TaskRepository,
          useValue: createMock<TaskRepository>(),
        },
      ],
    }).compile();

    taskRepository = module.get(TaskRepository);
    service = module.get(TaskService);
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('create should not allow overdue tasks', async () => {
    // Prepare
    const new_task = createRandomNewTask({
      deadline: new Date("2020-01-01")
    });

    // Execute
    const result = service.create(new_task);

    // Verify
    expect(taskRepository.create).toHaveBeenCalledTimes(0);
    await expect(result).rejects.toBeInstanceOf(UnprocessableEntityException);
  });

  it('create should pass valid tasks to the repository', async () => {
    // Prepare
    const new_task = createRandomNewTask();
    const expected_task = createRandomTask(new_task.data);
    taskRepository.create.mockReturnValue(Promise.resolve(expected_task));

    // Execute
    const result = service.create(new_task);

    // Verify
    expect(taskRepository.create).toHaveBeenCalledWith(new_task);
    await expect(result).resolves.toStrictEqual(expected_task);
  });
});

