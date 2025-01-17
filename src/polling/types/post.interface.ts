export interface Post {
    id: string;
    modified: string;
  }
  
  export interface PostsResponse {
    posts: {
      nodes: Post[];
    };
  }
  