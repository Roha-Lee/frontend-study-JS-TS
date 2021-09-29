import Router from './core/router'
import { NewsFeedView, NewsDetailView } from './page';
import { Store } from './types'

const store: Store = {
  currentPage: 1,
  newsPerPage: 10, 
  feeds: []
};

// window 객체에 넣어주기 
declare global {
  interface Window {
    store: Store;
  }
}

window.store = store;

const router: Router = new Router();
const newsFeedView = new NewsFeedView('root');
const newsDetailView = new NewsDetailView('root');

router.setDefaultPage(newsFeedView);
router.addRoutePath('/page/', newsFeedView);
router.addRoutePath('/show/', newsDetailView);
router.route();