import React, { Component } from 'react'

import { intl } from './Intl.js'
import { withToast } from 'react-awesome-toasts'

import UserProfile from './UserProfile.js'

/* eslint-disable-next-line */
import { getStorage, getStorageObject, setStorage, setStorageObject } from '../util/storage.js'
/* eslint-disable-next-line */
import { getUrlParameter, getServiceInfo, login, testIfJwtWorks, testIfRefreshTokenWorks, updateSavedUserData, updateSavedUserDataIfNeeded, toggleTheme, redirectToLogin, generateRegisterToken, listRegisterTokens, invalidateRegisterToken, listUsers, modifyUser, deleteUser, modifyUserSelf } from '../util/util.js'

class UserProfileWrapper extends Component {

  state = {
    userObject: JSON.parse(getStorage('user') || '{}')
  }

  onStartEditingAccountDetails = () => {
    console.log('start editing')
  }

  onCancelEditingAccountDetails = () => {
    console.log('cancel editing')
  }

  onSaveEditingAccountDetails = (changes) => {
    console.log('save editing', changes)

    const userObject = JSON.parse(getStorage('user'))

    const aggregated_changes = {
      first_name: changes.first_name ? changes.first_name : userObject.first_name,
      last_name: changes.last_name ? changes.last_name : userObject.last_name,
      ...(changes.password ? { password: changes.password } : {})
    }

    modifyUserSelf(aggregated_changes, (err, userObject) => {
      if(err) {
        this.props.toast.show({
          text: intl('something_went_wrong'),
          actionText: intl('close'),
          onActionClick: this.props.toast.hide
        })
      } else {
        this.props.toast.show({
          text: intl('successfully_updated'),
          actionText: intl('close'),
          onActionClick: this.props.toast.hide
        })

        setStorage('user', JSON.stringify(userObject))
        this.setState({ userObject: userObject })
      }
    })

  }

  onDeleteAccount = () => {
    console.log('deleting account')
  }

  render() {

    const userObject = JSON.parse(getStorage('user'))

    return (
      <div className="user-profile-wrapper">

      <UserProfile
        basic={false}
        editable={true}
        offline={false}
        user={userObject}
        onEdit={this.onStartEditingAccountDetails}
        onCancel={this.onCancelEditingAccountDetails}
        onSave={this.onSaveEditingAccountDetails}
        onDelete={this.onDeleteAccount}
      />

    </div>
    )
  }
}

export default withToast(UserProfileWrapper)