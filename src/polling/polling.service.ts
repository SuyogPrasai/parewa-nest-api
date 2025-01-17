import { Injectable, Logger } from '@nestjs/common';
import { gql, GraphQLClient } from 'graphql-request';
import { Cron } from '@nestjs/schedule';

// Define the Post interface
interface Post {
  id: string;
  modified: string;
}

// Define the response structure
interface PostsResponse {
  posts: {
    nodes: Post[];
  };
}

@Injectable()
export class PollingService {
  private readonly logger = new Logger(PollingService.name);
  private readonly graphqlClient: GraphQLClient;
  private readonly polling_interval = 2; // Polling interval in seconds

  private previousPosts: Post[] = [];

  // Define the cron expression outside the decorator
  private readonly cronExpression = `*/${this.polling_interval} * * * * *`;

  constructor() {
    this.graphqlClient = new GraphQLClient('http://localhost:8080/graphql');
  }

  // Use the static cron expression in the decorator
  @Cron('*/10 * * * * *') // Cron expression is static here, value is fixed
  async pollPosts() {
    const query = gql`
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
      // Specify the response type using a generic to tell TypeScript the structure of the response
      const data = await this.graphqlClient.request<PostsResponse>(query);

      const currentPosts = data.posts.nodes;

      // Compare the previous state with the current state
      this.comparePosts(currentPosts);

      // Update the previous posts to the current ones for the next comparison
      this.previousPosts = currentPosts;
    } catch (error) {
      this.logger.error('Error fetching posts:', error.message);
    }
  }

  comparePosts(currentPosts: Post[]) {
    const currentIds = new Set(currentPosts.map((post) => post.id));
    const previousIds = new Set(this.previousPosts.map((post) => post.id));

    // Check for added posts
    currentPosts.forEach((currentPost) => {
      const prevPost = this.previousPosts.find((prevPost) => prevPost.id === currentPost.id);
      if (!prevPost) {
        // Log added post
        this.logger.log(`Added post: ID=${currentPost.id}`);
      } else if (prevPost.modified !== currentPost.modified) {
        // Log modified post
        this.logger.log(`Post modified: ID=${currentPost.id}, Modified Time changed`);
      }
    });

    // Check for removed posts
    this.previousPosts.forEach((previousPost) => {
      if (!currentIds.has(previousPost.id)) {
        // Log removed post
        this.logger.log(`Removed post: ID=${previousPost.id}`);
      }
    });
  }
}
