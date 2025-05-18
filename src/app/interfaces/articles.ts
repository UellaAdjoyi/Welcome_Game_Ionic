interface Article {
  user_id: any;
  id: number;
  title: string;
  forum_content: string;
  user: { login: string };
  media?: string;
}

interface ForumFeedResponse {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  articles: Article[];
}
