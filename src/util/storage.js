function getStorage(key) {
  var st = window.localStorage.getItem(window.location.hostname + '.storage')
  if(st) {
    st = JSON.parse(st)
  } else {
    st = {}
    window.localStorage.setItem(window.location.hostname + '.storage', '{}')
  }

  return st[key]
}

function getStorageObject() {
  var st = window.localStorage.getItem(window.location.hostname + '.storage')
  if(st) {
    return JSON.parse(st)
  } else {
    window.localStorage.setItem(window.location.hostname + '.storage', '{}')
    return {}
  }
}

function setStorage(key, value) {
  var st = window.localStorage.getItem(window.location.hostname + '.storage')

  if(st) st = JSON.parse(st)
  else st = {}
  
  st[key] = value
  window.localStorage.setItem(window.location.hostname + '.storage', JSON.stringify(st))
  return value
}

function setStorageObject(obj) {
  var st = window.localStorage.getItem(window.location.hostname + '.storage')

  if(st) st = JSON.parse(st)
  else st = {}

  var keys = Object.keys(obj)
  for(var i = 0; i < keys.length; i++) {
    st[keys[i]] = obj[keys[i]]
  }

  window.localStorage.setItem(window.location.hostname + '.storage', JSON.stringify(st))
  return obj
}

function removeStorage(key) {
  return setStorage(key, undefined)
}

function resetStorage() {
  window.localStorage.setItem(window.location.hostname + '.storage', '{}')
}

export {
  getStorage,
  getStorageObject,
  setStorage,
  setStorageObject,
  removeStorage,
  resetStorage
}