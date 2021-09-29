import View from '../core/view'

export interface Store {
  currentPage: number;
  newsPerPage: number; 
  feeds: NewsFeed[];
}

export interface News {
  readonly id: number;
  readonly time_ago: string;
  readonly title: string;
  readonly content: string;
  readonly url: string;
  readonly user: string;
}

export interface NewsFeed extends News {
  readonly comments_count: number;
  readonly points: number;
  read?: boolean;
}

export interface NewsDetail extends News {
  readonly comments: NewsComment[];
}

export interface NewsComment extends NewsDetail {
  readonly level: number;
}

export interface RouteInfo {
  path: string;
  page: View;
}