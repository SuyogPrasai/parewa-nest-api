import { Post } from '../types/post.interface';

export function comparePosts(currentPosts: Post[], previousPosts: Post[], logger: any) {
  const currentIds = new Set(currentPosts.map((post) => post.id));
  const previousIds = new Set(previousPosts.map((post) => post.id));

  currentPosts.forEach((currentPost) => {
    const prevPost = previousPosts.find((prev) => prev.id === currentPost.id);
    if (!prevPost) {
      logger.log(`Added post: ID=${currentPost.id}`);
    } else if (prevPost.modified !== currentPost.modified) {
      logger.log(`Post modified: ID=${currentPost.id}, Modified Time changed`);
    }
  });

  previousPosts.forEach((prevPost) => {
    if (!currentIds.has(prevPost.id)) {
      logger.log(`Removed post: ID=${prevPost.id}`);
    }
  });
}
