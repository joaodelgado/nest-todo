import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDbEntity } from './user.dbentity';
import { UserDbRepository } from './user.dbrepository';
import { UserRepository } from '../../domain/user/user.repository';

const providers = [{ provide: UserRepository, useClass: UserDbRepository }];

@Module({
  imports: [TypeOrmModule.forFeature([UserDbEntity])],
  providers: providers,
  exports: providers,
})
export class UserDbModule { }
