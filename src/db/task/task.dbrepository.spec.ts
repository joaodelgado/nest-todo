import * as fs from 'fs';
import { TaskDbRepository } from './task.dbrepository';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions, Repository } from 'typeorm';
import { TaskDbEntity } from './task.dbentity';
import { createRandomNewTask } from '../../domain/task/task.entity.spec';
import { savedRandomUser } from '../user/user.dbentity.spec';
import { User } from 'src/domain/user/user.entity';
import { UserDbEntity } from '../user/user.dbentity';

describe('TaskDbRepository', () => {
  let taskOrmRepository: Repository<TaskDbEntity>;
  let userOrmRepository: Repository<UserDbEntity>;
  let repository: TaskDbRepository;

  let config: TypeOrmModuleOptions;
  let datasource: DataSource;
  beforeAll(async () => {
    config = {
      type: 'sqlite',
      database: 'testTaskDbRepository',
      entities: [__dirname + '/../**/*dbentity.ts'],
      migrations: [__dirname + '/../migrations/*.ts'],
    };
    datasource = new DataSource(config as DataSourceOptions);
    await datasource.initialize();
    await datasource.runMigrations();

    taskOrmRepository = datasource.getRepository(TaskDbEntity);
    userOrmRepository = datasource.getRepository(UserDbEntity);

    repository = new TaskDbRepository(taskOrmRepository);
  });

  afterEach(async () => {
    await taskOrmRepository.clear();
    await userOrmRepository.clear();
  });

  afterAll(async () => {
    await datasource.destroy();
    fs.unlinkSync('testTaskDbRepository');
  });


  it('should be defined', () => {
    expect(repository).toBeDefined();
  });


  it('create should insert a task with no deadline successfully', async () => {
    // Prepare
    const user = await savedRandomUser(userOrmRepository);
    const new_task = await createRandomNewTask({
      created_by: user
    });

    // Execute
    const result = await repository.create(new_task);

    // Verify
    expect(result.data.id).toBeTruthy();
    expect(result.data.description).toBe(new_task.data.description);
    expect(result.data.deadline).toBeUndefined();
    await expect(taskOrmRepository.findOneBy({ id: result.data.id })).resolves.toBeTruthy();
  });

  it('create should insert a task with a deadline successfully', async () => {
    // Prepare
    const user = await savedRandomUser(userOrmRepository);
    const new_task = await createRandomNewTask({
      created_by: user,
      deadline: new Date("2024-01-01")
    });

    // Execute
    const result = await repository.create(new_task);

    // Verify
    expect(result.data.id).toBeTruthy();
    expect(result.data.description).toBe(new_task.data.description);
    expect(result.data.deadline).toBe(new_task.data.deadline);
    await expect(taskOrmRepository.findOneBy({ id: result.data.id })).resolves.toBeTruthy();
  });

});
