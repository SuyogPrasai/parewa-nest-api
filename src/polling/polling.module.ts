import { Module } from '@nestjs/common';
import { PollingService } from './polling.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [PollingService]
})
export class PollingModule {}
