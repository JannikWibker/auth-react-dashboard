import React, { Component } from 'react'

// import '../css/userprofile.css'

import ProfilePicture from './ProfilePicture'
import { Intl, intl } from './Intl.js'

export default class UserProfile extends Component {
  el = {
    first_name: React.createRef(),
    last_name: React.createRef(),
    password: React.createRef(),
    repeat_password: React.createRef()
  }

  state = {
    editing: false
  }

  startEditing = () => Promise.resolve((this.props.onEdit || (() => {}))({}))
    .then(() => this.setState({ editing: true }))

  cancelEditing = () => Promise.resolve((this.props.onCancel || (() => {}))({}))
    .then(() => this.setState({ editing: false }))

  saveEditing = () => Promise.resolve((this.props.onSave || (() => {}))({
    first_name: this.el.first_name.current.value,
    last_name: this.el.last_name.current.value,
    ...(this.el.password.current.value && this.el.repeat_password.current.value && this.el.password.current.value === this.el.repeat_password.current.value ? { password: this.el.password.current.value } : {})
  }))
    .then(() => this.setState({ editing: false }))

  render() {
    const { user, basic=true, editable=false } = this.props
    const { editing=false } = this.state

    return (
      <div className="user-profile-wrapper">
        <ProfilePicture size={84} letter={(user.username ||'?').substring(0,1).toUpperCase()} />
        <div className="user-profile-info-wrapper">

          <div className="user-profile-group-horizontal">
            <div className="user-profile-field-block">
                <label className="user-profile-label" htmlFor="user-profile-username"><Intl word="username" /></label><br />
                {editable && editing
                  ? <span id="user-profile-username" className="user-profile-field">{user.username}</span>
                  : <span id="user-profile-username" className="user-profile-field">{user.username}</span>
                }
              </div>
          </div>

          <div className="user-profile-group-vertical">
            <div className="user-profile-field-block">
              <label className="user-profile-label" htmlFor="user-profile-account_type"><Intl word="account_type" /></label><br />
              <span id="user-profile-account_type" className="user-profile-field">{user.account_type}</span>
            </div>
            <div className="user-profile-field-block">
              <label className="user-profile-label" htmlFor="user-profile-email"><Intl word="email" /></label><br />
              {editable && editing
                ? <span id="user-profile-email" className="user-profile-field">{user.email}</span>
                : <span id="user-profile-email" className="user-profile-field">{user.email}</span>
              }
            </div>
          </div>
          
          <div className="user-profile-group-vertical">
            <div className="user-profile-field-block">
              <label className="user-profile-label" htmlFor="user-profile-first_name"><Intl word="first_name" /></label><br />
              {editable && editing
                ? <input id="user-profile-first_name" ref={this.el.first_name} className="text-input input-small user-profile-input" defaultValue={user.first_name} />
                : <span id="user-profile-first_name" className="user-profile-field">{user.first_name}</span>
              }
            </div>
            <div className="user-profile-field-block">
              <label className="user-profile-label" htmlFor="user-profile-last_name"><Intl word="last_name" /></label><br />
              {editable && editing
                ? <input id="user-profile-last_name" ref={this.el.last_name} className="text-input input-small user-profile-input " defaultValue={user.last_name} />
                : <span id="user-profile-last_name" className="user-profile-field">{user.last_name}</span>
              }
            </div>
          </div>

          {basic ? null : editable && editing
            ? (
              <div className="user-profile-group-horizontal">
                <div className="user-profile-field-block">
                  <label className="user-profile-label" htmlFor="user-profile-password"><Intl word="password"></Intl></label><br />
                  <input id="user-profile-password" ref={this.el.password} className="text-input input-small user-profile-input" type="password" />
                </div>
                <div className="user-profile-field-block">
                  <label className="user-profile-label" htmlFor="user-profile-repeat-password"><Intl word="repeat_password"></Intl></label><br />
                  <input id="user-profile-repeat-password" ref={this.el.repeat_password} className="text-input input-small user-profile-input" type="password" />
                </div>
              </div>
            ) : (
              <div className="user-profile-group-horizontal">
                <div className="user-profile-field-block">
                  <label className="user-profile-label" htmlFor="user-profile-password"><Intl word="password"></Intl></label><br />
                  <span id="user-profile-password" className="user-profile-field">{'********'}</span>
                </div>
              </div>
            )
          }

          {this.props.offline ? (
            <div className="user-profile-btn-wrapper">
              <button className="btn btn-normal" disabled tooltip-top={intl('edit_offline_mode')}><Intl word="edit" /></button>
            </div>
          ) : null}

          {editable && !this.props.offline ? (
            <div className="user-profile-btn-wrapper">
              {this.state.editing ? (
                <React.Fragment>
                  <button className="btn btn-normal" onClick={this.cancelEditing}><Intl word="cancel" /></button>
                  <button className="btn btn-normal btn-green" onClick={this.saveEditing}><Intl word="save" /></button>
                  <button className="btn btn-normal btn-red" style={{marginLeft: 8}} onClick={this.props.onDelete}><Intl word="delete_account" /></button>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <button className="btn btn-normal btn-purple" onClick={this.startEditing}><Intl word="edit" /></button>
                  <button className="btn btn-normal" onClick={this.props.onLogout}><Intl word="logout" /></button>
                </React.Fragment>
              )}
            </div>
          ) : (
            null
          )}

            <div className="user-profile-indicator-wrapper">
              <div className="info-text">account {intl('modification_date').toLowerCase()}: <span id="account-modification-date-info">{new Date(user.modification_date).toLocaleString()}</span></div>
              <div className="info-text">account {intl('creation_date').toLowerCase()}: <span id="account-creation-date-info">{new Date(user.creation_date).toLocaleString()}</span></div>
            </div>

          </div>
      </div>
    )
  }
}