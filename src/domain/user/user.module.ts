import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDbModule } from '../../db/user/user.module';

@Module({
  // TODO can this dependency be removed and resolved by the main AppModule instead?
  imports: [UserDbModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserDomainModule { }

