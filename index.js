let request = require('request');

request = request.defaults({jar: true})

const LoginUrl = "https://one.aoaomoe.club/auth/login";

const CheckInUrl = "https://one.aoaomoe.club/user/checkin";

const argv = process.argv;

const email = argv[2] || '';
const passwd = argv[3] || '';

if (!email || !passwd) {
  console.error("用户名或密码无效，arg1用户名 arg2密码");
  return;
}

checkIn(email, passwd);

function checkIn(user, pass) {
  request.post(LoginUrl, {
    form: {
      email: user,
      passwd: pass
    }
  }, function (err, res) {
    if (err) {
      console.log(err);
      return;
    }
    const body = JSON.parse(res.body);
    const {msg, ret} = body;
    console.log(msg);
    if (parseInt(ret) === 1) {
      console.log('开始签到')
      request.post(CheckInUrl, function(err, res) {
        if (err) {
          console.log(err);
          return
        }
        const body = JSON.parse(res.body);
        const {ret, msg} = body;
        if (parseInt(ret) === 1) {
          console.log('签到成功');
        }
        console.log(msg);

      })
    }
  });
}

