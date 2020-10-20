import { getStorage, getStorageObject, setStorage, setStorageObject } from './storage.js'

const storageObject = getStorageObject()

const formatDate = (date=new Date()) => {
  return '' + 
    (date.getFullYear()).toString().padStart(4, '0') + '-' + 
    (date.getMonth()+1).toString().padStart(2, '0') + '-' +
    (date.getDate()).toString().padStart(2, '0') + '@' +
    (date.getHours()).toString().padStart(2, '0') + ':' +
    (date.getMinutes()).toString().padStart(2, '0') + ':' +
    (date.getSeconds()).toString().padStart(2, '0')
}

const capitalize = s => s.substr(0, 1).toUpperCase() + s.substr(1).toLowerCase();

function getUrlParameter(name) {
  name = name
    .replace(/[\[]/, '\\[') /* eslint-disable-line no-useless-escape */
    .replace(/[\]]/, '\\]') /* eslint-disable-line no-useless-escape */
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
  var results = regex.exec(window.location.search)
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

function getServiceInfo(id, cb) {
  window.fetch('/service/by-id/' + id)
    .then(function(res) { return res.json() })
    .then(cb)
}

function login(username, passwordOrRefreshToken, isRefreshToken=false, getRefreshToken=false, alternativeOrigin="") {
  return window.fetch(alternativeOrigin + '/login', {
    method: 'POST',
    body: JSON.stringify({
      username: username,
      password: passwordOrRefreshToken,
      isRefreshToken: isRefreshToken,
      getRefreshToken: getRefreshToken
    }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Device-Id': getStorage('device_id') || ''
    }
  })
  .then(function(res) { return res.status === 401 ? Promise.reject({ status: res.status, message: res.json() }) : res.json() })
  .then(function(json) {
    console.log(json)
    if(json.device_id) {
      setStorage('device_id', json.device_id)
    }
    return json
  })
}

function logout(alternativeOrigin="") {
  return window.fetch(alternativeOrigin + '/logout', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Device-Id': getStorage('device_id') || '',
      'Authorization': 'Bearer ' + getStorage('jwt')
    }
  })
    .then(function(res) { return res.status === 200 
        ? (setStorage('remember_me', false), Promise.resolve(res.json()))
        : Promise.reject(res.json())
    })
}

function testIfJwtWorks(token, cb, alternativeOrigin='') {
  window.fetch(alternativeOrigin + '/users/test', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
    .then(function(res) { return res.json() })
    .then(function(json) {
      if(json.status === 'success') {
        setStorage('user', JSON.stringify(json.user))
        return cb(null, true)
      } else {
        return cb(null, false)
      }
      
    })
    .catch(function catchTestIfJwtWorks(err) { return cb(err, false)})
}

function testIfRefreshTokenWorks(token, cb, alternativeOrigin="") {
  login(storageObject.username, token, true, false, alternativeOrigin)
    // .then(function(res) { return res.json() })
    .then(function(json) {
      if(json.status === 'failure') {
        return cb(null, false)
      } else {
        setStorage('jwt', json.token)
        return cb(null, true)
      }
    })
    .catch(function catchTestIfRefreshTokenWorks(err) { return cb(err, false) })
}

function updateSavedUserData(token, cb) {
  // testIfRefreshTokenWorks tries to log-in with the refresh-token, this is exactly what
  // is needed here. The verb 'test' may be somewhat wrong but it is the wanted behaviour.
  // It also updates the stored jwt
  testIfRefreshTokenWorks(token, function(err, bool) {
    if(bool) {
      // testIfJwtWorks updates the saved user data. This is again exactly what is wanted,
      // but also again somewhat misleading name-whise. The result of the test is unimportant
      // since it must true since the jwt has just been generated.
      testIfJwtWorks(getStorage('jwt'), function(err, bool) {
        if(bool) cb(null, JSON.parse(getStorage('user')))
        else cb({ message: 'invalid JWT', status: 'failure', error: err }, null)
      })
    } else {
      cb({ message: 'invalid RefreshToken', status: 'failure', error: err }, null)
    }
  })
}

function updateSavedUserDataIfNeeded(token, cb) {
  const storageObject = getStorageObject()
  if(storageObject.user || storageObject.refreshToken) {
    try {
      updateSavedUserData(storageObject.refreshToken, function cbUpdateSavedUserData(err, user) {
        if(err)  {
          setStorageObject({
            theme: getStorage('theme'),
            jwt: null,
            refreshToken: null,
            remember_me: false,
            user: null,
            username: null,
            fullname: null,
          })
          cb({ message: 'could not retrieve updated user object, invalid RefreshToken, resetting storage', status: 'failure', error: err }, null)
        } else {
          cb(null, user)
        }
      })
    } catch (err) {
      cb({ message: 'could not deserialize storageObject.user, this means the data is corrupted', status: 'failure', error: err }, null)
    }
  } else {
    cb({ message: 'no saved user found', status: 'failure', error: null }, null)
  }
}

function toggleTheme(theme, doSetStorage=true) {
  if(theme) {
    document.body.className = 'theme-' + theme
    if(doSetStorage) setStorage('theme', theme)
  } else {
    if(document.body.className === 'theme-dark') {
    document.body.className = 'theme-light'
    if(doSetStorage) setStorage('theme', 'light')
    } else {
      document.body.className = 'theme-dark'
      if(doSetStorage) setStorage('theme', 'dark')
    }
  }
}

function redirectToLogin() {
  console.log('redirected to login')
  return window.location.replace('/login?id=auth')
}

function generateRegisterToken({ account_type, metadata, permanent, expire_at, usage_count }, cb) {
  window.fetch('/generate-register-token', {
    method: 'POST',
    body: JSON.stringify({
      account_type: account_type,
      metadata: metadata,
      permanent: permanent,
      expireAt: permanent ? 0 : expire_at,
      usage_count: usage_count
    }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getStorage('jwt')
    }
  })
    .then(function(res) { return res.json() })
    .then(function(json) {
      if(json.status !== 'success') {
        cb(json, null)
      } else {
        cb(null, json)
      }
    })
    .catch(function(err) {
      cb(err, null)
    })
}

function listRegisterTokens(cb, extra=false) {
  window.fetch('/list-register-tokens' + (extra ? '/decrypt' : ''), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + getStorage('jwt')
    }
  })
    .then(function(res) { return res.json() })
    .then(function(json) {
      if(json.status !== 'success') {
        cb(json, null)
      } else {
        cb(null, json)
      }
    })
    .catch(function(err) {
      cb(err, null)
    })
}

function invalidateRegisterToken(id, cb) {
  window.fetch('/invalidate-register-token', {
    method: 'DELETE',
    body: JSON.stringify({ id: id }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getStorage('jwt')
    }
  })
    .then(function(res) { return res.json() })
    .then(function(json) {
      if(json.status !== 'success') {
        cb(json, null)
      } else {
        cb(null, json)
      }
    })
    .catch(function(err) {
      cb(err, null)
    })
}

function getAllUserDevices() {
  return window.fetch('/devices', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + getStorage('jwt')
    }
  })
    .then(function(res) { return res.json() })
}

function revokeUserDevice(device_id) {
  return window.fetch('/device', {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + getStorage('jwt')
    },
    body: JSON.stringify({
      device_id: device_id
    })
  })
    .then(function(res) { return res.json() })
}

function listUsers(cb) {
  window.fetch('/users/list', {
    method: 'GET', // is not a GET request YET, will change soon
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + getStorage('jwt')
    }
  })
    .then(function(res) { return res.json() })
    .then(function(json) {
      if(json.status !== 'success') {
        cb(json, null)
      } else {
        cb(null, json.users)
      }
    })
    .catch(function(err) {
      cb(err, null)
    })
}

function modifyUser(changes, username, cb) {
  window.fetch('/users/modify', {
    method: 'POST',
    body: JSON.stringify(({ username: username, ...changes })),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getStorage('jwt')
    }
  })
    .then(function(res) { return res.json() })
    .then(function thenModifyUser(json) {
      cb(null, json)
    })
    .catch(function catchModifyUser() {
      cb(true, null) // this needs to become a real error instead of just 'true'
    })
}

function addUser(values, cb) {
  window.fetch('/users/admin/add', {
    method: 'POST',
    body: JSON.stringify(values),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getStorage('jwt')
    }
  })
    .then(function(res) { return res.json() })
    .then(function thenAddUser(json) {
      cb(null, json.data) // user
    })
    .catch(function catchAddUser() {
      cb(true, null) // this needs to become a real error instead of just 'true'
    })
}

function deleteUser(id, cb) {
  window.fetch('/users/', {
    method: 'DELETE',
    body: JSON.stringify({ id: id }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getStorage('jwt')
    }
  })
    .then(function(res) { return res.json() })
    .then(function thenDeleteUser(json) {
      cb(null, json)
    })
    .catch(function catchDeleteUser() {
      cb(true, null) // this needs to become a real error instead of just 'true'
    })
}

function modifyUserSelf(changes, cb) {
  window.fetch('/users/modify-self', {
    method: 'POST',
    body: JSON.stringify(changes),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getStorage('jwt')
    }
  })
    .then(function(res) { return res.json() })
    .then(function thenModifySelf(json) {
      if(json.status === 'success') {
        // testIfRefreshTokenWorks tries to log-in with the refresh-token, this is exactly what
        // is needed here. The verb 'test' may be somewhat wrong but it is the wanted behaviour.
        // testIfRefreshTokenWorks(getStorage('refreshToken'), function(err, bool) {
        //   if(bool) {
        //     // testIfJwtWorks updates the saved user data. This is again exactly what is wanted,
        //     // but also again somewhat misleading name-whise. The result of the test is unimportant
        //     // since it must true since the jwt has just been generated.
        //     testIfJwtWorks(getStorage('jwt'), function(err, bool) {
        //       if(bool) cb(null, JSON.parse(getStorage('user')))
        //       else cb(true, null)
        //     })
        //   }
        // })
        updateSavedUserData(getStorage('refreshToken'), cb)
      } else {
        cb(true, null) // this needs to become a real error instead of just 'true'
      }
    })
    .catch(function catchModifySelf() {
      cb(true, null) // this needs to become a real error instead of just 'true'
    })
}

const getServerVersion = () =>
  window.fetch('/current-version')
    .then(res => res.text())

const getServerUptime = () => 
  window.fetch('/uptime')
    .then(res => res.text())
    .then(uptime => new Date(parseInt(uptime, 10)))

export {
  formatDate,
  capitalize,
  getUrlParameter,
  getServiceInfo,
  login,
  logout,
  testIfJwtWorks,
  testIfRefreshTokenWorks,
  updateSavedUserData,
  updateSavedUserDataIfNeeded,
  toggleTheme,
  redirectToLogin,
  generateRegisterToken,
  listRegisterTokens,
  invalidateRegisterToken,
  getAllUserDevices,
  revokeUserDevice,
  listUsers,
  modifyUser,
  addUser,
  deleteUser,
  modifyUserSelf,
  getServerVersion,
  getServerUptime,
}