import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PollingModule } from './polling/polling.module';
import { GraphqlModule } from './graphql/graphql.module';
import { ConfigModule } from '@nestjs/config';
import { NewsModule } from './news/news.module';
import { ArticlesModule } from './articles/articles.module';
import { EmailsModule } from './emails/emails.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration globally available
    }),
    PollingModule, 
    GraphqlModule, NewsModule, ArticlesModule, EmailsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
