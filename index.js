let request = require('request');
const path = require('path');
let users;
try{
  users = require(
    path.resolve(__dirname, "users.json")
  )
}catch(e){
  if(!users){
    const argv = process.argv;
    const email = argv[2] || '';
    const passwd = argv[3] || '';
    if (!email || !passwd) {
      console.error("用户名或密码无效，arg1用户名 arg2密码");
      return;
    }
    users = [
      {
        username: email,
        password: passwd
      }
    ]
  }
}
request = request.defaults({jar: true})

const LoginUrl = "https://one.aoaomoe.club/auth/login";

const CheckInUrl = "https://one.aoaomoe.club/user/checkin";

users.map(user => checkIn(user.username, user.password));

function checkIn(user, pass) {
  request.post(LoginUrl, {
    form: {
      email: user,
      passwd: pass
    }
  }, function (err, res) {
    if (err) {
      log(err);
      return;
    }
    const body = JSON.parse(res.body);
    const {msg, ret} = body;
    log(user, msg);
    if (parseInt(ret) === 1) {
      log(user, '开始签到')
      request.post(CheckInUrl, function(err, res) {
        if (err) {
          log(err);
          return
        }
        const body = JSON.parse(res.body);
        const {ret, msg} = body;
        if (parseInt(ret) === 1) {
          log(user, '签到成功');
        }
        log(user, msg);

      })
    }
  });
}

function log(...args) {
  console.log(new Date().toLocaleString(), args)
}