import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { DomainModule } from '../../domain/domain.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [DomainModule],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthApiModule { }

