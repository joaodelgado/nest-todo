import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UserService } from '../../domain/user/user.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { RegisterRequest } from './auth.request.dto';
import { faker } from '@faker-js/faker';

describe('AuthController', () => {
  let userService: DeepMocked<UserService>;
  let controller: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{
        provide: UserService,
        useValue: createMock<UserService>(),
      }],
    }).compile();

    controller = app.get(AuthController);
    userService = app.get(UserService);
  });

  describe('register', () => {

    it('should accept a valid user', async () => {
      // Prepare
      const request = new RegisterRequest();
      request.username = faker.internet.userName();
      request.password = faker.internet.password();

      // Execute
      await controller.register(request);

      // Verify
      expect(userService.create).toHaveBeenCalledTimes(1);
    });

  });
});

