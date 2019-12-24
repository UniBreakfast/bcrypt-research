{
  var c = console.log, { assign } = Object

  Object.defineProperty(global, 'now',
    { get: ()=> String(new Date).match(/\d+:\d+:\d+/)[0] } )

  let lastTime
  Object.prototype.c = function(label) {
    const time = now
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

// sync or async functions to find user and update his state
find = login => users.find(user => user.login == login),
setGuess =(user, guess)=> user.guess = guess,
setLast =(user, timestamp)=> user.last = timestamp,

check = require('./check.js')(find, setGuess, setLast)

// try in the console:
// check('Alex', 'jeronimo').then(r=>r.c()).catch(c)
// and
// check('Bob', 'wrongpass').then(r=>r.c()).catch(c)
// multiple times - you'll see the delays, increasing with more guesses

setInterval(t, 1e6)

assign(global, {c, hashit, compare, check})
