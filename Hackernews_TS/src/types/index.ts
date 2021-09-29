import View from '../core/view'
export interface NewsStore {
  getAllFeeds: () => NewsFeed[];
  getFeed: (position: number) => NewsFeed;
  setFeed: (feeds: NewsFeed[]) => void;
  makeRead: (id: number) => void;
  hasFeeds: boolean;
  currentPage: number;
  newsPerPage: number;
  numberOfFeed: number;
  nextPage: number;
  prevPage: number;
}
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