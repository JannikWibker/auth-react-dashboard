import { observable, action, decorate } from 'mobx'

import { listUsers, addUser, modifyUser, deleteUser } from '../util/util.js'

class UserStore {

  users = []

  constructor() {
    this.listUsers()
  }

  listUsers = () => {
    return new Promise((resolve, reject) => {
      listUsers((err, users) => {
        if(err) {
          // I dont know how error handling here would work. This will mostly be called from the constructor meaning that no meaningful UI can be modified to show that an error has occured
          reject(err)
        } else {
          this.users = Object.values(users)
          resolve(this.users)
        }
      })
    })
  }

  addUser = (values) => {
    return new Promise((resolve, reject) => {
      addUser(values, (err, user) => {
        if(err) {
          reject(err)
        } else {
          this.users.push(user)
          resolve(user)
        }
      })
    })
  }

  modifyUser = (changes, username) => {
    return new Promise((resolve, reject) => {
      modifyUser(changes, username, (err, json) => {
        console.log(err, json)
        if(err) {
          reject(err)
        } else {
          const index = this.users.findIndex(user => user.username === username)
          this.users[index] = { ...this.users[index], ...changes }
          resolve(this.users[index])
        }
      })
    })
  }

  deleteUser = (id) => {
    return new Promise((resolve, reject) => {
      deleteUser(id, (err, json) => {
        if(err) {
          reject(err)
        } else {
          console.log(json)
          const index = this.users.findIndex(user => user.id === id)
          const rtn = this.users[index]
          this.users.splice(index, 1)
          console.log(this.users)
          resolve(rtn)
        }
      })
    })
  }
  
}

decorate(UserStore, {
  users: observable,
  listUsers: action,
  addUser: action,
  modifyUser: action,
  deleteUser: action
})

const userStore = new UserStore()
export default userStore