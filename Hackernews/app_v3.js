// v3. 페이징 구현 
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
  const newsList = ['<ul>']
  for(let i = store.newsPerPage * (store.currentPage - 1); 
      i < Math.min(store.newsPerPage * store.currentPage, newsFeed.length); 
      i += 1) {
    const {title, comments_count, id} = newsFeed[i]
    // 마크업 구조를 한눈에 파악하기 용이
    newsList.push(`
    <li>
      <a href="#/show/${id}"> 
        ${title} (${comments_count})
      </a>
    </li>
    `)  
  }
  newsList.push('</ul>')
  newsList.push(`
  <div>
    <a href="#/page/${store.currentPage > 1 ? store.currentPage - 1 : 1}">이전 페이지</a>
    <a href="#/page/${store.currentPage < maxPage ? store.currentPage + 1 : maxPage}">다음 페이지</a>
  </div>
  `)
  container.innerHTML = newsList.join('')
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