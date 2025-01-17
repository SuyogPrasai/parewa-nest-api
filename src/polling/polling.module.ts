import { Module } from '@nestjs/common';
import { PollingService } from './polling.service';
import { ScheduleModule } from '@nestjs/schedule';
import { GraphqlModule } from 'src/graphql/graphql.module';

@Module({
  imports: [ScheduleModule.forRoot(), GraphqlModule],
  providers: [PollingService]
})
export class PollingModule {}
