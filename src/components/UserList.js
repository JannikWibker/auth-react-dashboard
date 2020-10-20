import React, { Component } from 'react'

import { inject, observer } from 'mobx-react'
import { intl, Intl } from './Intl.js'

import { formatDate } from '../util/util.js'

import EditIcon from './icons/Edit.js'
import XIcon from './icons/X.js'
import CheckIcon from './icons/Check.js'
import TrashIcon from './icons/Trash.js'

import Select, { Option } from './Select.js'

import { withToast } from 'react-awesome-toasts'

class UserList extends Component {

  state = {
    users: [],
    editing_user: null,
    editing_account_type: null
  }

  el = {
    email: React.createRef(),
    account_type: React.createRef(),
    first_name: React.createRef(),
    last_name: React.createRef(),
    password: React.createRef(),
    metadata: React.createRef(),
  }

  editingChangeAccountType = (account_type) => {
    this.setState({ editing_account_type: account_type })
  }

  editUser(username, account_type) {
    console.log('now editing user ' + username)
    this.setState({ editing_user: username, editing_account_type: account_type })
  }

  saveEditUser = () => {

    const user = this.props.UserStore.users.find(user => user.username === this.state.editing_user)

    const changes = {}

    if(this.el.email.current.value !== user.email) changes.email = this.el.email.current.value
    if(this.el.first_name.current.value !== user.first_name) changes.first_name = this.el.first_name.current.value
    if(this.el.last_name.current.value !== user.last_name) changes.last_name = this.el.last_name.current.value

    if(this.el.password.current.value) changes.password = this.el.password.current.value
    if(this.state.editing_account_type !== user.account_type) changes.account_type = this.state.editing_account_type

    if(this.el.metadata.current.value !== user.metadata) {
      try {
        changes.metadata = JSON.parse(this.el.metadata.current.value)
      } catch (err) {
        console.log(err)
        this.setState({ editing_user: null })
        this.props.toast.show({
          text: intl('error') + " - " + intl('malformed_json'),
          actionText: intl('close'),
          onActionClick: this.props.toast.hide
        })
      }
    }

    this.props.UserStore.modifyUser(changes, user.username)
      .then(json => {
        console.log(json)
        this.setState({ editing_user: null })
      })
      .catch(err => {
        console.log(err)
        this.setState({ editing_user: null })
      })
  }

  cancelEditUser = () => {
    this.setState({ editing_user: null, editing_account_type: null })
  }

  deleteUser = () => {
    console.log('deleting user ' + this.state.editing_user)

    const index = this.props.UserStore.users.findIndex(user => user.username === this.state.editing_user)

    const id = this.props.UserStore.users[index].id

    this.props.UserStore.deleteUser(id)
      .then((json) => {
        console.log(json)
        this.props.toast.show({
          text: intl('successfully_deleted'),
          actionText: intl('close'),
          onActionClick: this.props.toast.hide,
        })

        this.setState({
          editing_user: null,
          editing_account_type: null,
        })
      })
      .catch((err) => {
        console.log(err)
        this.props.toast.show({
          text: intl('something_went_wrong'),
          actionText: intl('close'),
          onActionClick: this.props.toast.hide,
        })
      })
  }

  render() {
    console.log(this.state)
    return (
      <form>
        <table className="editable-table">
          <thead>
            <tr className="register-token-heading-row">
              <th className="table-heading"><Intl word="username" /></th>
              <th className="table-heading"><Intl word="id" /></th>
              <th className="table-heading"><Intl word="account_type" /></th>
              <th className="table-heading"><Intl word="email" /></th>
              <th className="table-heading"><Intl word="first_name" /></th>
              <th className="table-heading"><Intl word="last_name" /></th>
              <th className="table-heading"><Intl word="creation_date" /></th>
              <th className="table-heading"><Intl word="modification_date" /></th>
              <th className="table-heading"><Intl word="metadata" /></th>
              <th className="table-heading"><Intl word="password" /></th>
              <th className="table-heading">{this.state.editing_user !== null ? (
                <React.Fragment>
                  <Intl word="edit" /> / <Intl word="save" /> / <Intl word="cancel" />
                </React.Fragment>
              ) : (
                <Intl word="edit" />
              )}</th>
            </tr>
          </thead>
          <tbody>
            {this.props.UserStore.users.map(({ id, username, account_type, email, first_name, last_name, creation_date, modification_date, metadata }) => this.state.editing_user === username ? (
              <tr key={id} className="editing">
                <td className="table-data"><span id="user-list-username"  className="user-list-field">{username}</span></td>
                <td className="table-data"><span id="user-list-id"        className="user-list-field">{id}</span></td>
                <td className="table-data table-input">
                <Select className="select-small" value={this.state.editing_account_type} style={{ width: 100, height: 28 }} onChange={this.editingChangeAccountType}>
                  <Option value="default">default</Option>
                  <Option value="privileged">privileged</Option>
                  <Option value="admin">admin</Option>
                </Select>
                </td>
                <td className="table-data table-input"><input autoComplete="off" id="user-list-email"      ref={this.el.email}       className="text-input input-small user-list-input" defaultValue={email} /></td>
                <td className="table-data table-input"><input autoComplete="off" id="user-list-first_name" ref={this.el.first_name}  className="text-input input-small user-list-input" defaultValue={first_name} /></td>
                <td className="table-data table-input"><input autoComplete="off" id="user-list-last_name"  ref={this.el.last_name}   className="text-input input-small user-list-input" defaultValue={last_name} /></td>
                <td className="table-data"><span  id="user-list-creation_date"                        className="user-list-field">{formatDate(new Date(creation_date))}</span></td>
                <td className="table-data"><span  id="user-list-modification_date"                    className="user-list-field">{formatDate(new Date(modification_date))}</span></td>
                <td className="table-data table-input"><input autoComplete="off" id="user-list-metadata"   ref={this.el.metadata}    className="text-input input-small user-list-input" defaultValue={JSON.stringify(metadata)} /></td>
                <td className="table-data table-input"><input autoComplete="off" id="user-list-password"   ref={this.el.password}    className="text-input input-small user-list-input" defaultValue="" placeholder={intl('new_password')} type="password" /></td>
                <td className="table-data">
                  <div className="save-wrapper icon-hover"   tooltip-top={intl('save')}    aria-label={intl('save')}   onClick={this.saveEditUser}><CheckIcon width={16} height={16} /></div>
                  <div className="cancel-wrapper icon-hover" tooltip-top={intl('cancel')}  aria-label={intl('cancel')} onClick={this.cancelEditUser}><XIcon width={16} height={16} /></div>
                  <div className="delete-wrapper icon-hover" tooltip-top={intl('delete')}  aria-label={intl('delete')} onClick={this.deleteUser}><TrashIcon width={16} height={16} /></div>
                </td>
              </tr>
            ) : (
              <tr key={id}>
                <td className="table-data"><span className="user-list-field">{username}</span></td>
                <td className="table-data"><span className="user-list-field">{id}</span></td>
                <td className="table-data"><span className="user-list-field">{account_type}</span></td>
                <td className="table-data"><span className="user-list-field">{email}</span></td>
                <td className="table-data"><span className="user-list-field">{first_name}</span></td>
                <td className="table-data"><span className="user-list-field">{last_name}</span></td>
                <td className="table-data"><span className="user-list-field">{formatDate(new Date(creation_date)).replace('@', ', ')}</span></td>
                <td className="table-data"><span className="user-list-field">{formatDate(new Date(modification_date)).replace('@', ', ')}</span></td>
                <td className="table-data"><span className="user-list-field">{JSON.stringify(metadata)}</span></td>
                <td className="table-data"><span className="user-list-field">{'********'}</span></td>
                <td className="table-data">
                <div className="edit-wrapper icon-hover" tooltip-top={intl('edit')} aria-label={intl('edit')} onClick={() => this.editUser(username, account_type)}><EditIcon width={16} height={16} /></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
    )
  }
}

export default withToast(inject('UserStore')(observer(UserList)))