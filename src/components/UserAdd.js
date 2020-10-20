import React, { Component } from 'react'

import { inject, observer } from 'mobx-react'
import { withToast } from 'react-awesome-toasts'

import Select, { Option } from './Select.js'
import { Intl, intl } from './Intl.js'

import { account_types } from '../stores/UserStore.js'

const METADATA_DEFAULT = '{}'
const ACCOUNT_TYPE_DEFAULT = account_types[0]

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
    account_type: ACCOUNT_TYPE_DEFAULT
  }

  addUser = () => {
    let metadata
    try {
      metadata = JSON.parse(this.el.metadata.current.value);
    } catch(err) {
      return this.props.toast.show({
        text: intl('error') + ' - ' + intl('malformed_json'),
        actionText: intl('close'),
        onActionClick: this.props.toast.hide
      })
    }
    const values = {
      username: this.el.username.current.value,
      email: this.el.email.current.value,
      first_name: this.el.first_name.current.value,
      last_name: this.el.last_name.current.value,
      password: this.el.password.current.value,
      metadata: metadata,
      account_type: this.state.account_type,
      is_passwordless: !this.el.password.current.value
    }
    console.log(values)

    this.props.UserStore.addUser(values)
      .then(json => {
        this.props.toast.show({
          text: intl('successfully_added'),
          actionText: intl('close'),
          onActionClick: this.props.toast.hide
        })
      })
      .catch(err => {
        console.log(err)
        this.props.toasts.show({
          text: intl('something_went_wrong') + ' (add user)',
          actionText: intl('close'),
          onActionClick: this.props.toast.hide
        })
      })
  }

  clearInput = () => {
    this.el.username.current.value = ''
    this.el.email.current.value = ''
    this.el.first_name.current.value = ''
    this.el.last_name.current.value = ''
    this.el.password.current.value = ''
    this.el.metadata.current.value = METADATA_DEFAULT
    this.setState({
      account_type: ACCOUNT_TYPE_DEFAULT
    })
  }

  updateAccountType = (account_type = ACCOUNT_TYPE_DEFAULT) => {
    this.setState({ 
      account_type: account_type
    })
  }

  render() {
    return (
      <div className="user-add">
        <form>
          <div className="user-profile-group-horizontal">
            <div className="user-profile-field-block">
              <label className="user-profile-label" htmlFor="user-add-username"><Intl word="username" /></label><br />
              <input id="user-add-username" ref={this.el.username} autoComplete={'off'} className="text-input input-small user-add-input" />
            </div>
            <div className="user-profile-field-block">
              <label className="user-profile-label" htmlFor="user-add-email"><Intl word="email" /></label><br />
              <input id="user-add-email" ref={this.el.email} autoComplete={'off'} className="text-input input-small user-add-input" />
            </div>
          </div>

          <div className="user-profile-group-horizontal">
            <div className="user-profile-field-block">
              <label className="user-profile-label" htmlFor="user-add-first_name"><Intl word="first_name" /></label><br />
              <input id="user-add-first_name" ref={this.el.first_name} autoComplete={'off'} className="text-input input-small user-add-input" />
            </div>
            <div className="user-profile-field-block">
              <label className="user-profile-label" htmlFor="user-add-last_name"><Intl word="last_name" /></label><br />
              <input id="user-add-last_name" ref={this.el.last_name} autoComplete={'off'} className="text-input input-small user-add-input" />
            </div>
          </div>

          <div className="user-profile-group-horizontal">
            <div className="user-profile-field-block">
              <label className="user-profile-label" htmlFor="user-add-password"><Intl word="password"></Intl></label><br />
              <input id="user-add-password" ref={this.el.password} autoComplete={'off'} className="text-input input-small user-add-input" type="password" />
            </div>
            <div className="user-profile-field-block">
              <label className="user-profile-label" htmlFor="user-add-account_type"><Intl word="account_type"></Intl></label><br />
              <Select id="user-add-account_type" value={this.state.account_type} style={{ width: 152, height: 32 }} onChange={this.updateAccountType} placeholder={intl('account_type')}>
                {account_types.map((type, i) => (
                  <Option key={i} value={type}>{type}</Option>
                ))}
              </Select>
            </div>
          </div>
          <div className="user-profile-group-horizontal">
            <div className="user-profile-field-block">
              <label className="user-profile-label" htmlFor="user-add-metadata"><Intl word="metadata" /></label><br />
              <input id="user-add-metadata" ref={this.el.metadata} autoComplete={'off'} className="text-input input-small user-add-input monospace-input" placeholder={intl('metadata')} defaultValue={METADATA_DEFAULT} />
            </div>
          </div>
          <div className="user-profile-btn-wrapper">
            <button className="btn btn-normal btn-green" type="button" onClick={this.addUser}><Intl word="add" /></button>
            <button className="btn btn-normal" type="button" onClick={this.clearInput}><Intl word="clear" /></button>
          </div>
        </form>
      </div>
    )
  }
}

export default withToast(inject('UserStore')(observer(UserAdd)))