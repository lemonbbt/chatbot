const http = require('http');
http.createServer((req, res) => { res.end('24시간 돌리는중!'); }).listen(8080);//24시간을 위해서 서버 열기

const Entbot = require("entbot");
const bot = new Entbot();
const fs = require("fs");
const difflib = require("difflib");

const texts = JSON.parse(fs.readFileSync("./reply.json", "utf8"));

bot.addEventListener("login", function(){
    console.log("로그인 완료!");
});

bot.addEventListener("error", function(message){
    console.log(`오류: ${message}`);
});

function diff(a, b){
  s = new difflib.SequenceMatcher(null, a, b);
  return s.ratio();
}

function shuffle(a){
  return a.map(function(n){
    return {v: n, n: Math.random()}
  }).sort(function(n, m){
    return n.n < m.n? -1: 1;
  }).map(function(n){
    return n.v;
  })
}

function rnd(min, max){
  return Math.random() * (max-min) + min;
}

function bestMatch(a, b=8){
  var t = shuffle(texts)
  .map(function(n){
    return {v: n, sq: diff(a, n) + rnd(-0.1, 0.1)};
  }).sort(function(n, m){
    return n.sq - m.sq;
  }).map(function(n){
    return n.v;
  });
  return t.slice(t.length - b);
}

bot.login("😀54382", process.env.pass)
.then(function(bot){
    const app = bot.createApp();

    app.addEventListener("create", function(message, data){

        console.log("새 메시지: ", message, data.id);

        if(message.length <= 17 && message.length > 1){
          var d = bestMatch(message, 4);
          var rnd = ~~(Math.random() * d.length);
          console.log("대답: ", d[rnd]);
          app.reply(data.id, d[rnd]);
        }

    });

    app.run();
});
