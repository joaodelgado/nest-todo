import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import * as crypt from '../utils/crypt.util';
import { NewUser, User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) { }

  async create(new_user: NewUser): Promise<User> {
    // TODO missing tests
    if (await this.userRepository.exists(new_user.data.username)) {
      throw new ConflictException("Username already taken");
    }
    return this.userRepository.create(new_user);
  }

  async authenticate(
    username: string,
    password: string,
  ): Promise<User | undefined> {
    let existingUser = await this.userRepository.get(username);
    if (existingUser == null) {
      return undefined;
    }
    if (!(await crypt.matches(password, existingUser.data.pass_hash))) {
      return undefined;
    }

    return existingUser;
  }
}

