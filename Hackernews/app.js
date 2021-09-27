// v6. 읽은 상태 도입하기 

const container = document.getElementById('root')
const ajax = new XMLHttpRequest()
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_UTL = 'https://api.hnpwa.com/v0/item/@id.json'
const store = {
  currentPage: 1,
  newsPerPage: 7, 
  feeds: []
}

function getData(url) {
  ajax.open('GET', url, false)
  ajax.send()
  return JSON.parse(ajax.response)
}

function makeFeeds(feeds) {
  for (let i = 0; i < feeds.length; i+=1){
    feeds[i].read = false;
  }
  return feeds
}

function newsFeed() {
  let newsFeed = store.feeds
  if(newsFeed.length === 0){
    newsFeed = store.feeds = makeFeeds(getData(NEWS_URL))
  }
  
  const maxPage = Math.ceil(newsFeed.length / store.newsPerPage)
  let template = `
  <div class="bg-gray-600 min-h-screen">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                Previous
              </a>
              <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                Next
              </a>
            </div>
          </div> 
        </div>
      </div>
      <div class="p-4 text-2xl text-gray-700">
        {{__news_feed__}}        
      </div>
    </div>
  `

  const newsList = []
  for (let i = store.newsPerPage * (store.currentPage - 1); i < Math.min(store.newsPerPage * store.currentPage, newsFeed.length); i += 1) {
    const {
      title,
      comments_count,
      id, 
      user, 
      points, 
      time_ago,
      read
    } = newsFeed[i]
    newsList.push(`
    <div class="p-6 ${read ? 'bg-blue-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
        <div class="flex">
          <div class="flex-auto">
            <a href="#/show/${id}">${title}</a>  
          </div>
          <div class="text-center text-sm">
            <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${comments_count}</div>
          </div>
        </div>
        <div class="flex mt-3">
          <div class="grid grid-cols-3 text-sm text-gray-500">
            <div><i class="fas fa-user mr-1"></i>${user}</div>
            <div><i class="fas fa-heart mr-1"></i>${points}</div>
            <div><i class="far fa-clock mr-1"></i>${time_ago}</div>
          </div>  
        </div>
      </div>    
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

  const {
    title,
    content, 
    comments
  } = getData(CONTENT_UTL.replace('@id', id))
  let template = `
  <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-full border rounded-xl bg-white m-6 p-4 ">
        <h2>${title}</h2>
        <div class="text-gray-400 h-20">
          ${content}
        </div>

        {{__comments__}}

      </div>
    </div>
    `
  function makeComment(comments, called = 0) {
    const commentString = []
    for(let i = 0; i < comments.length; i += 1){
      let { user, time_ago, content, comments:inner_comments} = comments[i]
      commentString.push(`
      <div style="padding-left: ${called * 40}px;" class="mt-4">
        <div class="text-gray-400">
          <i class="fa fa-sort-up mr-2"></i>
          <strong>${user}</strong> ${time_ago}
        </div>
        <p class="text-gray-700">${content}</p>
      </div>
      `)
      if(inner_comments.length > 0){
        commentString.push(makeComment(inner_comments, called + 1))
      }
    }
    return commentString.join('')
  }
  container.innerHTML = template.replace('{{__comments__}}', makeComment(comments));

  for(let i = 0; i < store.feeds.length; i+=1){
    if(store.feeds[i].id === Number(id)){
      store.feeds[i].read = true
      break
    }
  }
}

function router() {
  const routePath = location.hash
  if (routePath === '') {
    newsFeed()
  } else if (routePath.indexOf('#/page/') >= 0) {
    store.currentPage = Number(location.hash.substr(7))
    newsFeed()
  } else {
    newsDetail()
  }
}

window.addEventListener('hashchange', router)
router()