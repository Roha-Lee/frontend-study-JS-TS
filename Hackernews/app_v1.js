// 입력 데이터 가져오기 
const container = document.getElementById('root')
const ajax = new XMLHttpRequest()
const content = document.createElement('div')

const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
// 사용자가 뭘 고를지 모르기 때문에 일단 마킹만 해두자(@id)
const CONTENT_UTL = 'https://api.hnpwa.com/v0/item/@id.json'
ajax.open('GET', NEWS_URL, false)
ajax.send()

// 데이터 가공 
// JSON data -> Object data 
const newsFeed = JSON.parse(ajax.response) 
// document라는 객체가 HTML을 조작하는데 필요한 것들을 가지고 있다. 
const ul = document.createElement('ul')

// 우리가 보는 화면인 window객체와 거기에 속해있는 hashchange이벤트
window.addEventListener('hashchange', function () {
  // 주소값과 관련된 location객체
  const id = location.hash.substr(1)
  ajax.open('GET', CONTENT_UTL.replace('@id', id), false)
  ajax.send()
  const newsContent = JSON.parse(ajax.response)
  const title = document.createElement('h1')
  title.innerHTML = newsContent.title
  content.appendChild(title)
})

for(let i = 0; i < 10; i += 1) {
  const li = document.createElement('li')
  const a = document.createElement('a')
  a.innerHTML = `${newsFeed[i].title} (${newsFeed[i].comments_count})`
  // #은 해시 -> 북마크
  a.href = `#${newsFeed[i].id}`
  li.appendChild(a)
  ul.appendChild(li)
}

// 출력
container.appendChild(ul)
container.appendChild(content)