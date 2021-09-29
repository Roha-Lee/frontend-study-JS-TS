const express = require('express');
const app = express();

app.get('/hello', (req, resp) => {
  resp.send({okay: 'Okay'});
});

app.listen(8080, ()=>{
  console.log('서버가 시작되었습니다.')
});