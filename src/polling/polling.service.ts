import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

import { comparePosts } from './utils/post.utils';
import { Post, PostsResponse } from './types/post.interface';
import { GraphqlService } from 'src/graphql/graphql.service';


@Injectable()
export class PollingService {
  private readonly logger = new Logger(PollingService.name);
  private previousPosts: Post[] = [];

  constructor(
    private readonly graphqlService: GraphqlService,
    private readonly configService: ConfigService,
  ) {}

  // Use the variable for the cron expression, no need for 'this.'
  @Cron('*/2 * * * * *') // 2 stands for 2 seconds
  async pollPosts() {
    const query = `
      {
        posts {
          nodes {
            id
            modified
          }
        }
      }
    `;

    try {
      const data = await this.graphqlService.execute<PostsResponse>(query);
      const currentPosts = data.posts.nodes;
      comparePosts(currentPosts, this.previousPosts, this.logger);
      this.previousPosts = currentPosts;
    } catch (error) {
      this.logger.error('Error fetching posts:', error.message);
    }
  }
}
