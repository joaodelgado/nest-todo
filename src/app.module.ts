import { Module } from '@nestjs/common';
import { DomainModule } from './domain/domain.module';
import { ApiModule } from './api/api.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [ApiModule, DbModule, DomainModule]
})
export class AppModule { }
