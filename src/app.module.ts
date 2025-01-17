import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PollingModule } from './polling/polling.module';
import { GraphqlModule } from './graphql/graphql.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration globally available
    }),
    PollingModule, 
    GraphqlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
