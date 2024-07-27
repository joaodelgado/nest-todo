import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { createRandomNewUser, createRandomUser } from './user.entity.spec';
import { faker } from '@faker-js/faker';

describe('UserService', () => {
  let userRepository: DeepMocked<UserRepository>;
  let service: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: createMock<UserRepository>(),
        },
      ],
    }).compile();

    userRepository = module.get(UserRepository);
    service = module.get(UserService);
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('create', () => {
    it('should pass valid users to the repository', async () => {
      // Prepare
      const new_user = await createRandomNewUser();
      const expected_user = await createRandomUser(new_user.data);
      userRepository.exists.mockReturnValue(Promise.resolve(false));
      userRepository.create.mockReturnValue(Promise.resolve(expected_user));

      // Execute
      const result = await service.create(new_user);

      // Verify
      expect(userRepository.create).toHaveBeenCalledWith(new_user);
      expect(result).toStrictEqual(expected_user);
    });
  });

  describe('authenticate', () => {
    it('should return a user when given with a valid password', async () => {
      // Prepare
      const password = faker.internet.password();
      const user = await createRandomUser({}, password);
      userRepository.get.mockReturnValue(Promise.resolve(user));

      // Execute
      const result = await service.authenticate(user.data.username, password);

      // Verify
      expect(userRepository.get).toHaveBeenCalledWith(user.data.username);
      expect(result).toStrictEqual(user);
    });

    it('should return undefined when given with an invalid password', async () => {
      // Prepare
      const user = await createRandomUser();
      userRepository.get.mockReturnValue(Promise.resolve(user));

      // Execute
      const result = await service.authenticate(user.data.username, "invalid");

      // Verify
      expect(userRepository.get).toHaveBeenCalledWith(user.data.username);
      expect(result).toBeUndefined();
    });

    it('should return undefined when given with an non-existing username', async () => {
      // Prepare
      userRepository.get.mockReturnValue(Promise.resolve(undefined));

      // Execute
      const result = await service.authenticate("username", "invalid");

      // Verify
      expect(userRepository.get).toHaveBeenCalledWith("username");
      expect(result).toBeUndefined();
    });
  });

});

