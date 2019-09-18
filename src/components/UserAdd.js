import React, { Component } from 'react'

import { inject, observer } from 'mobx-react'
import { withToast } from 'react-awesome-toasts'

import Select, { Option } from './Select.js'
import { Intl, intl } from './Intl.js'

const mock_add_user = () => Promise.resolve({ message: 'idk', status: 'success' })

class UserAdd extends Component {

  el = {
    username: React.createRef(),
    email: React.createRef(),
    first_name: React.createRef(),
    last_name: React.createRef(),
    password: React.createRef(),
    metadata: React.createRef(),
  }

  state = {
    account_type: 'default'
  }

  constructor(props) {
    super(props)
  }

  addUser = () => {
    const values = {
      username: this.el.username.current.value,
      email: this.el.email.current.value,
      first_name: this.el.first_name.current.value,
      last_name: this.el.last_name.current.value,
      password: this.el.password.current.value,
      metadata: this.el.metadata.current.value,
      account_type: this.state.account_type
    }
    console.log(values)

    mock_add_user(values)
      .then(json => {
        if(json.status === 'success') {
          this.props.toast.show({
            text: intl(''),
            actionText: intl('close'),
            onACtionClick: this.props.hide
          })
          // TODO: add user to user list and all that (maybe using some kind of store (mobx))
        } else {
          console.log(json)
          this.props.toasts.show({
            text: intl('something_went_wrong') + ' (add user)',
            actionText: intl('close'),
            onActionClick: this.props.hide
          })
        }
      })
  }

  clearInput = () => {
    this.el.username.current.value = ''
    this.el.email.current.value = ''
    this.el.first_name.current.value = ''
    this.el.last_name.current.value = ''
    this.el.password.current.value = ''
    this.el.metadata.current.value = '{}'
    this.setState({
      account_type: 'default'
    })
  }

  updateAccountType = (account_type = 'default') => {
    this.setState({ 
      account_type: account_type
    })
  }

  render() {
    return (
      <div className="user-add">
        <div className="user-profile-field-block">
          <input id="user-add-username"   autoComplete={'off'} className="text-input input-small user-add-input" ref={this.el.username}   placeholder={intl('username')}   />
          <input id="user-add-email"      autoComplete={'off'} className="text-input input-small user-add-input" ref={this.el.email}      placeholder={intl('email')}      />
        </div>
        <div className="user-profile-field-block">
          <input id="user-add-first_name" autoComplete={'off'} className="text-input input-small user-add-input" ref={this.el.first_name} placeholder={intl('first_name')} />
          <input id="user-add-last_name"  autoComplete={'off'} className="text-input input-small user-add-input" ref={this.el.last_name}  placeholder={intl('last_name')}  />
        </div>
        <div className="user-profile-field-block">
          <input id="user-add-password"   autoComplete={'off'} className="text-input input-small user-add-input" ref={this.el.password}   placeholder={intl('password')}   />
          <Select value={this.state.account_type} style={{ width: 152, height: 32 }} onChange={this.updateAccountType}>
            <Option value="default">default</Option>
            <Option value="privileged">privileged</Option>
            <Option value="admin">admin</Option>
          </Select>
        </div>
        <div className="user-profile-field-block">
          <input id="user-add-metadata"   autoComplete={'off'} className="text-input input-small user-add-input" ref={this.el.metadata}   placeholder={intl('metadata')} defaultValue={'{}'} />
        </div>
        <div className="user-profile-btn-wrapper">
          <button className="btn btn-normal btn-green" onClick={this.addUser}><Intl word="add" /></button>
          <button className="btn btn-normal" onClick={this.clearInput}><Intl word="clear" /></button>
        </div>
      </div>
    )
  }
}

export default withToast(inject('UserStore')(observer(UserAdd)))