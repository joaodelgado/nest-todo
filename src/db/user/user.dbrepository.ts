import { Injectable } from '@nestjs/common';
import { UserDbEntity } from './user.dbentity';
import { UserRepository } from '../../domain/user/user.repository';
import { NewUser, User } from '../../domain/user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserDbRepository implements UserRepository {
  constructor(
    @InjectRepository(UserDbEntity)
    private userOrmRepostory: Repository<UserDbEntity>,
  ) { }

  async get(username: string): Promise<User | null> {
    const user = await this.userOrmRepostory.findOneBy({ username: username });
    return user?.to_domain();
  }

  async create(user: NewUser): Promise<User> {
    const saved = await this.userOrmRepostory.save(
      UserDbEntity.from_domain(user),
    );
    return saved.to_domain();
  }
}
