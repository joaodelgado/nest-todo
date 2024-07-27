import { NewUser, User } from './user.entity';

export interface UserRepository {
  get(username: string): Promise<User | null>;
  create(user: NewUser): Promise<User>;
}

export const UserRepository = Symbol('UserRepository');

