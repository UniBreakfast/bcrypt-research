{
  var c = console.log, { assign } = Object

  let lastTime
  Object.prototype.c = function(label) {
    const time = new Date().toLocaleTimeString('en', {hour12: false})
    console.log(time == lastTime? '': lastTime = time,
      typeof label=='string'? label+':' : typeof label=='number'? label+'.' :'',
        this.valueOf())
    return this.valueOf()
  }

  let timestamp
  Object.prototype.t = function(label) {
    if (timestamp) {
      var ts = timestamp
      timestamp = process.hrtime().join('.')*1000
      console.log(typeof label=='string'? label+':'
        : typeof label=='number'? label+'.' :'', +(timestamp-ts).toFixed(3))
    }
    else timestamp = process.hrtime().join('.')*1000
    return this==global? null : this.valueOf()
  }
}

const

{ hash, compare } = require('bcryptjs'),

hashit = str => hash(str, 4),

users = [
  { login: 'Alex', pass: 'jeronimo',
    hash: '$2a$04$bbrFhxI7hw5CuDfqgX4FUu0HxD5PSiP3PI.vTNN.DXu2oA4z4B4e.' },
  { login: 'Bob', pass: 'cloverfield',
    hash: '$2a$04$L/lHMuQayzOoatMxyPwdAeoX57FTjEE3cF3/c8hp3eswn0fdmpt2i' }
],

check =(login, pass)=> new Promise((resolve, reject) => {
  if (check.locks[login]) return reject('wait')
  check.locks[login] = true
  const user = users.find(user => user.login == login)
  if (!user) return c('no such user')
  const now = Date.now(), { last=now, take=0, hash } = user
  user.last = now
  user.take = now-last > 3e5? 1 : Math.min(take+1, 9)
  const wait = Math.max(0, check.secs[user.take]*1e3 - (now-last))
  setTimeout(()=> compare(pass, hash).then(resolve)
    .then(()=> delete check.locks[login]), wait)
})
check.secs = [0, 0, 0, 3, 7, 15, 30, 60, 120, 240]
check.locks = {}

setInterval(t, 1e6)

assign(global, {c, hashit, compare, check})