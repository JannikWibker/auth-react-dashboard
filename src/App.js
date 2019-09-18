import React, { Component } from 'react'

import { ToastProvider } from 'react-awesome-toasts'

import { Provider } from 'mobx-react'
import UserStore from './stores/UserStore'

import UserProfileWrapper from './components/UserProfileWrapper.js'
import ThemeChooser from './components/ThemeChooser.js'
import Footer from './components/Footer.js'
import RegisterTokenList from './components/RegisterTokenList.js'
import RegisterTokenAdd from './components/RegisterTokenAdd.js'
import UserList from './components/UserList.js'
import UserAdd from './components/UserAdd.js'

/* eslint-disable-next-line */
import { getStorage, getStorageObject, setStorage, setStorageObject } from './util/storage.js'
/* eslint-disable-next-line */
import { getUrlParameter, getServiceInfo, login, testIfJwtWorks, testIfRefreshTokenWorks, updateSavedUserData, updateSavedUserDataIfNeeded, toggleTheme, redirectToLogin, generateRegisterToken, listRegisterTokens, invalidateRegisterToken, listUsers, modifyUser, deleteUser, modifyUserSelf } from './util/util.js'

class App extends Component {

  state = {
    logged_in: false,
    userObject: JSON.parse(getStorage('user') || '{}')
  }

  constructor(props) {

    super(props)

    setStorage('jwt', window.REACT_APP_JWT)
    setStorage('refreshToken', window.REACT_APP_REFRESH_TOKEN)

    const storageObject = getStorageObject()

    console.log(storageObject)

    if(storageObject.theme) {
      toggleTheme(storageObject.theme)
    } else {
      toggleTheme('light')
    }

    if(storageObject.jwt) {
      testIfJwtWorks(storageObject.jwt, (err, bool) => {
        if(err) return redirectToLogin()

        if(bool) {
          this.setState({ logged_in: true })
        } else {
          testIfRefreshTokenWorks(storageObject.refreshToken, function cbTestIfRefreshTokenWorks(err, bool) {

            if(err) return redirectToLogin()

            if(bool) this.setState({ logged_in: true })
            else return redirectToLogin()

          })
        }
      })
    } else {
      testIfRefreshTokenWorks(storageObject.refreshToken, (err, bool) => {
        if(err) return redirectToLogin()
        if(bool) {
          this.setState({ logged_in: true })
        } else {
          return redirectToLogin()
        }
      })
    }

  }

  render() {
    return (
      <React.Fragment>

        <ThemeChooser onToggleTheme={() => toggleTheme()} />

        <div className="container">

          <Provider UserStore={UserStore}>
            <ToastProvider timeout={2000}>

              {this.state.logged_in ? (
                <div className="index main">

                  <div className="heading-sub">Your Information</div>

                  <UserProfileWrapper />

                  {this.state.userObject.account_type === 'admin' ? (
                    <div className="admin-panel-wrapper">

                    <div className="heading-sub-small">Register Tokens</div>
                    <div className="register_token-wrapper">

                      <RegisterTokenList />

                      <RegisterTokenAdd />
                    
                    </div>
          
                    <div className="heading-sub-small">List & Modify Users</div>
                    <div className="list_user-wrapper">

                      <UserList />
          
                    </div>

                    <div className="heading-sub-small">Add User</div>
                    <div className="add_user-wrapper">

                      <UserAdd />
          
                    </div>
          
                  </div>
                  ) : null}

                  <Footer />

                </div>
              ) : 'not logged in'}

            </ToastProvider>
          </Provider>

        </div>
      </React.Fragment>
    )
  }
}

export default App