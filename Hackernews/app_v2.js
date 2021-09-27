// HTML의 구조를 app_v1.js 코드만 봐서는 파악하기 어렵다. 
// DOM api가지고 구조를 만들어 나가면 한눈에 파악하기 어렵다. 
// DOM api를 최대한 사용하지 않고 만들면 됨 
// -> 문자열로 UI를 만드는 것이 파악에 더 유리하다. 

// v2. 라우터 구현

const container = document.getElementById('root')
const ajax = new XMLHttpRequest()
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_UTL = 'https://api.hnpwa.com/v0/item/@id.json'

// 반복되는 api 호출해서 json으로 변환하는 부분을 함수화 
function getData(url) {
  ajax.open('GET', url, false)
  ajax.send()
  return JSON.parse(ajax.response) 
}

function newsFeed(){
  const newsFeed = getData(NEWS_URL)
  const newsList = ['<ul>']
  for(let i = 0; i < 10; i += 1) {
    const {title, comments_count, id} = newsFeed[i]
    // 마크업 구조를 한눈에 파악하기 용이
    newsList.push(`
    <li>
      <a href="#${id}"> 
        ${title} (${comments_count})
      </a>
    </li>
    `)  
  }
  newsList.push('</ul>')
  container.innerHTML = newsList.join('')
}

function newsDetail() {
  const id = location.hash.substr(1)

  const {title} = getData(CONTENT_UTL.replace('@id', id))
  container.innerHTML = `
  <h1>${title}</h1>
  <div>
    <a href="#">목록으로</a>
  </div>`
}

function router() {
  const routePath = location.hash
  
  if (routePath === '') {
    newsFeed()
  } 
  else {
    newsDetail()
  }
}

window.addEventListener('hashchange', router)
router()