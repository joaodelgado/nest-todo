import { faker } from "@faker-js/faker";
import { NewTask, NewTaskData, Task, TaskData } from "./task.entity";

// Generators

export function createRandomNewTask(data?: Partial<NewTaskData>): NewTask {
  const task_data = {
    description: faker.lorem.words(),
    completed: false,
    created_at: new Date(),
  };
  Object.assign(task_data, data);

  return new NewTask(task_data);
}

export function createNewTask(data?: Partial<TaskData>): Task {
  const task_data = {
    id: faker.number.int(),
    description: faker.lorem.words(),
    completed: false,
    created_at: new Date(),
  };
  Object.assign(task_data, data);

  return new Task(task_data);
}

// Tests

describe('NewTask', () => {
  it('task with no deadline should not be overdue', () => {
    // Prepare
    const task = createRandomNewTask({
      deadline: null
    });

    // Execute
    const result = task.is_overdue();

    // Verify
    expect(result).toBeFalsy();
  });


  it('task with deadline in the future should not be overdue', () => {
    // Prepare
    const task = createRandomNewTask({
      deadline: new Date("2100-01-01")
    });

    // Execute
    const result = task.is_overdue();

    // Verify
    expect(result).toBeFalsy();
  });


  it('task with deadline in the past should be overdue', () => {
    // Prepare
    const task = createRandomNewTask({
      deadline: new Date("2020-01-01")
    });

    // Execute
    const result = task.is_overdue();

    // Verify
    expect(result).toBeTruthy();
  });
});
