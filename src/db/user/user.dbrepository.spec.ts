import * as fs from 'fs';
import { UserDbRepository } from './user.dbrepository';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions, Repository } from 'typeorm';
import { UserDbEntity } from './user.dbentity';
import { savedRandomUser } from './user.dbentity.spec';
import { createRandomNewUser } from '../../domain/user/user.entity.spec';

describe('UserDbRepository', () => {
  let userOrmRepository: Repository<UserDbEntity>;
  let repository: UserDbRepository;

  let config: TypeOrmModuleOptions;
  let datasource: DataSource;
  beforeAll(async () => {
    config = {
      type: 'sqlite',
      database: 'testUserDbRepository',
      entities: [__dirname + '/../**/*dbentity.ts'],
      migrations: [__dirname + '/../migrations/*.ts'],
    };
    datasource = new DataSource(config as DataSourceOptions);
    await datasource.initialize();
    await datasource.runMigrations();

    userOrmRepository = datasource.getRepository(UserDbEntity);

    repository = new UserDbRepository(userOrmRepository);
  });

  afterEach(async () => {
    await userOrmRepository.clear();
  });

  afterAll(async () => {
    await datasource.destroy();
    fs.unlinkSync('testUserDbRepository');
  });


  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('get', () => {
    it('should return a user when provided with an existing username', async () => {
      // Prepare
      const user = await savedRandomUser(userOrmRepository);

      // Execute
      const result = await repository.get(user.data.username);

      // Verify
      expect(result).toStrictEqual(user);
    });

    it('should return undefined when provided with an non existing username', async () => {
      // Prepare
      await savedRandomUser(userOrmRepository);

      // Execute
      const result = await repository.get("some-other-username");

      // Verify
      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should insert a valid user successfully', async () => {
      // Prepare
      const new_user = await createRandomNewUser();

      // Execute
      const result = await repository.create(new_user);

      // Verify
      expect(result.data.id).toBeTruthy();
      expect(result.data.username).toBe(new_user.data.username);
      expect(result.data.pass_hash).toBe(new_user.data.pass_hash);
      await expect(userOrmRepository.findOneBy({ id: result.data.id })).resolves.toBeTruthy();
    });
  });

});
