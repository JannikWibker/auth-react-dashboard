import { observable, action, decorate } from 'mobx'

import { listRegisterTokens, invalidateRegisterToken, generateRegisterToken } from '../util/util.js'

class RegisterTokenStore {
  register_tokens = []
  loading = false
  error = undefined

  constructor() {
    this.listRegisterTokens()
  }

  listRegisterTokens = () => {
    this.loading = true
    listRegisterTokens((err, json) => {
      if(err) {
        console.log(err, json)
        this.err = err
        this.loading = false
      } else {
        console.log(json)
        this.register_tokens = Object.keys(json.register_tokens).map(key => ({
          key: key, 
          token: json.register_tokens[key].register_token, 
          metadata: json.register_tokens[key].metadata
        }))
        this.err = undefined
        this.loading = false
      }
    }, true)
  }

  generateRegisterToken = ({ account_type, metadata, permanent, expire_at, usage_count }) => {
     // TODO what happens with permanent and usage_count, are they mutually exclusive or what are they?
    generateRegisterToken({ account_type, metadata, permanent, expire_at, usage_count }, (err, json) => {
      if(err) {
        this.err = err
      } else {
        // TODO: what to do here with `json`-object?
        this.listRegisterTokens() // TODO: can probably mock this request at first and then later replace the data
      }
    })
  }

  invalidateRegisterToken = (id) => {
    invalidateRegisterToken(id, (err, res) => {
      if(err) {
        this.err = err
        this.loading = false
      } else {
        this.listRegisterTokens() // TODO: can probably mock this request at first and then laster replace the data
      }
    })
  }
}

decorate(RegisterTokenStore, {
  register_tokens: observable,
  loading: observable,
  error: observable,
  listRegisterTokens: action,
  generateRegisterToken: action,
  invalidateRegisterToken: action,
})

const registerTokenStore = new RegisterTokenStore()
export default registerTokenStore