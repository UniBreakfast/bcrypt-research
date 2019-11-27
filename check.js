const

{ hash, compare } = require('bcryptjs'),

wait = delay => new Promise(resolve => setTimeout(resolve, delay))

// check = async (login, pass)=> {
//   if (check.locks[login]) throw 'wait'
//   const user = users.find(user => user.login == login)
//   if (!user) throw 'no such user'
//   check.locks[login] = true
//   const now = Date.now(), { last=now, take=-1, hash } = user
//   user.take = now-last > 3e5? 0 : Math.min(take+1, 9)
//   const delay = Math.max(0, check.secs[user.take]*1e3 - (now-last));
//   await wait(delay)
//   const verdict = await compare(pass, hash)
//   user.last = Date.now()
//   delete check.locks[login]
//   return verdict
// }
// check.secs = [0, 0, 0, 3, 7, 15, 30, 60, 120, 240]
// check.locks = {}

module.exports =(userGet, userSetGuess, userSetLast)=> {
  check = async (login, pass)=> {
    if (check.locks[login]) throw 'wait'
    const user = await userGet(login)
    if (!user) throw 'no such user'
    check.locks[login] = true
    const now = Date.now(), { last=now, guess=-1, hash } = user,
          nowGuess = now-last > 3e5? 0 : Math.min(guess+1, 9),
          delay = Math.max(0, check.secs[nowGuess]*1e3 - (now-last));
    userSetGuess(user, nowGuess)
    await wait(delay)
    const verdict = await compare(pass, hash)
    userSetLast(user, Date.now())
    delete check.locks[login]
    return verdict
  }
  check.secs = [0, 0, 0, 3, 7, 15, 30, 60, 120, 240]
  check.locks = {}
  return check
}