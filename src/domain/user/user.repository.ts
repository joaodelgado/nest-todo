import { NewUser, User } from './user.entity';

export interface UserRepository {
  exists(username: string): Promise<boolean>;
  get(username: string): Promise<User | undefined>;
  create(user: NewUser): Promise<User>;
}

export const UserRepository = Symbol('UserRepository');

