// v4. 양이 늘어나도 복잡도가 늘어나지 않도록 템플릿을 도입하자. 
// 코드와 UI를 분리하면 복잡도를 훨씬 낮추어 줄 수 있다. 
const container = document.getElementById('root')
const ajax = new XMLHttpRequest()
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_UTL = 'https://api.hnpwa.com/v0/item/@id.json'
const store = {
  currentPage: 1,
  newsPerPage: 7
} 

function getData(url) {
  ajax.open('GET', url, false)
  ajax.send()
  return JSON.parse(ajax.response) 
}

function newsFeed(){
  const newsFeed = getData(NEWS_URL)
  const maxPage = Math.ceil(newsFeed.length / store.newsPerPage)
  let template = `
  <div class="container mx-auto p-4">
    <h1>Hacker News</h1>
    <ul>
      {{__news_feed__}}
    </ul>
    <div>
      <a href="#/page/{{__prev_page__}}">이전 페이지</a>
      <a href="#/page/{{__next_page__}}">다음 페이지</a>
    </div>
  </div>
  `

  const newsList = []
  for(let i = store.newsPerPage * (store.currentPage - 1); 
      i < Math.min(store.newsPerPage * store.currentPage, newsFeed.length); 
      i += 1) {
    const {title, comments_count, id} = newsFeed[i]
    newsList.push(`
    <li>
      <a href="#/show/${id}"> 
        ${title} (${comments_count})
      </a>
    </li>
    `)  
  }

  template = template
    .replace('{{__news_feed__}}', newsList.join(''))
    .replace('{{__prev_page__}}', store.currentPage > 1 ? store.currentPage - 1 : 1)
    .replace('{{__next_page__}}', store.currentPage < maxPage ? store.currentPage + 1 : maxPage)
  
  container.innerHTML = template
}

function newsDetail() {
  const id = location.hash.substr(7)

  const {title} = getData(CONTENT_UTL.replace('@id', id))
  container.innerHTML = `
  <h1>${title}</h1>
  <div>
    <a href="#/page/${store.currentPage}">목록으로</a>
  </div>`
}

function router() {
  const routePath = location.hash
  if (routePath === '') {
    newsFeed()
  } else if(routePath.indexOf('#/page/')>=0){
    store.currentPage = Number(location.hash.substr(7))
    newsFeed()
  } else {
    newsDetail()
  }
}

window.addEventListener('hashchange', router)
router()