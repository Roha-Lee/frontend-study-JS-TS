import View from '../core/view';
import { NewsDetailApi } from '../core/api';
import { NewsDetail, NewsComment, NewsStore } from '../types';
import { CONTENT_URL } from '../config';

const template = `
<div class="bg-gray-600 min-h-screen pb-8">
  <div class="bg-white text-xl">
    <div class="mx-auto px-4">
      <div class="flex justify-between items-center py-6">
        <div class="flex justify-start">
          <h1 class="font-extrabold">Hacker News</h1>
        </div>
        <div class="items-center justify-end">
          <a href="#/page/{{__current_page__}}" class="text-gray-500">
            <i class="fa fa-times"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
  <div class="h-full border rounded-xl bg-white m-6 p-4 ">
    <h2>{{__title__}}</h2>
    <div class="text-gray-400 h-20">
      {{__content__}}
    </div>
    {{__comments__}}  
  </div>
</div>
`;
    
export default class NewsDetailView extends View{
  private store: NewsStore;
  constructor(containerId: string, store: NewsStore) {
    super(containerId, template);
    this.store = store;
  }
  
  render(): void{
    const id = location.hash.substr(7);
    const api = new NewsDetailApi(CONTENT_URL.replace('@id', id));
    const newsDetail: NewsDetail = api.getData();

    this.store.makeRead(Number(id));

    this.setTemplateData('comments', this.makeComment(newsDetail.comments));
    this.setTemplateData('title', newsDetail.title);
    this.setTemplateData('content', newsDetail.content);
    this.setTemplateData('current_page', String(this.store.currentPage));

    this.updateView();
  }

  private makeComment(comments: NewsComment[]): string {
    for(let i = 0; i < comments.length; i += 1){
      let { user, time_ago, content, comments:inner_comments, level} = comments[i]
      this.addHtml(`
      <div style="padding-left: ${level * 40}px;" class="mt-4">
        <div class="text-gray-400">
          <i class="fa fa-sort-up mr-2"></i>
          <strong>${user}</strong> ${time_ago}
        </div>
        <p class="text-gray-700">${content}</p>
      </div>
      `);
      if(inner_comments.length > 0){
        this.addHtml(this.makeComment(inner_comments));
      }
    }
    return this.getHtml();
  }  
}
