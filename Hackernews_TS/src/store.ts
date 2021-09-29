import { NewsFeed, NewsStore } from './types'

export default class Store implements NewsStore{
  private feeds: NewsFeed[];
  private _currentPage: number;
  private _newsPerPage: number;
  
  constructor() {
    this.feeds = [];
    this._currentPage = 1;
    this._newsPerPage = 10;
  }
  
  get newsPerPage() {
    return this._newsPerPage;
  }

  get currentPage() {
    return this._currentPage;
  }

  set currentPage(page: number) {
    this._currentPage = page;
  }

  get nextPage(): number {
    const maxPage = Math.ceil(this.feeds.length / this._newsPerPage);
    return this._currentPage < maxPage ? this._currentPage + 1 : maxPage;
  }

  get prevPage(): number {
    return this._currentPage > 1 ? this._currentPage - 1 : 1;
  }
  
  get numberOfFeed(): number {
    return this.feeds.length;
  }

  get hasFeeds(): boolean {
    return this.feeds.length > 0;
  }

  getAllFeeds(): NewsFeed[] {
    return this.feeds;
  }

  getFeed(position: number): NewsFeed {
    return this.feeds[position];
  }

  setFeed(feeds: NewsFeed[]): void {
    this.feeds = feeds.map(feed => ({
      ...feed, 
      read: false
    }));
  }

  makeRead(id: number): void {
    const feed = this.feeds.find((feed: NewsFeed) => feed.id === id);
    if (feed) {
      feed.read = true;
    }
  }
}
