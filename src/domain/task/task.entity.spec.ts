import { faker } from "@faker-js/faker";
import { NewTask, NewTaskData, Task, TaskData } from "./task.entity";
import { createRandomUser } from "../user/user.entity.spec";

// Generators

export async function createRandomNewTask(data?: Partial<NewTaskData>): Promise<NewTask> {
  const task_data = {
    description: faker.lorem.words(),
    completed: false,
    created_at: new Date(),
    created_by: await createRandomUser(),
  };
  Object.assign(task_data, data);

  return new NewTask(task_data);
}

export async function createRandomTask(data?: Partial<TaskData>): Promise<Task> {
  const task_data = {
    id: faker.number.int(),
    description: faker.lorem.words(),
    completed: false,
    created_at: new Date(),
    created_by: await createRandomUser(),
  };
  Object.assign(task_data, data);

  return new Task(task_data);
}

// Tests

describe('NewTask', () => {
  it('task with no deadline should not be overdue', async () => {
    // Prepare
    const task = await createRandomNewTask({
      deadline: null
    });

    // Execute
    const result = task.is_overdue();

    // Verify
    expect(result).toBeFalsy();
  });


  it('task with deadline in the future should not be overdue', async () => {
    // Prepare
    const task = await createRandomNewTask({
      deadline: new Date("2100-01-01")
    });

    // Execute
    const result = task.is_overdue();

    // Verify
    expect(result).toBeFalsy();
  });


  it('task with deadline in the past should be overdue', async () => {
    // Prepare
    const task = await createRandomNewTask({
      deadline: new Date("2020-01-01")
    });

    // Execute
    const result = task.is_overdue();

    // Verify
    expect(result).toBeTruthy();
  });
});
