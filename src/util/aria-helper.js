/* eslint-disable no-unused-expressions */

const onKeyboard = (keys, cb) => event => {
  console.log(event.key)
  switch (event.key) {
    case 'Enter': keys.includes('enter') && cb(event)
    case ' ':     keys.includes('space') && !!(event.preventDefault(), cb(event))
    default:      keys.includes(event.key) && cb(event)
  }
}

export {
  onKeyboard
}