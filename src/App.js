import React, { Component } from 'react'

import { Intl } from './components/Intl.js'

import { ToastProvider } from 'react-awesome-toasts'
import Modal from 'react-modal'

import { Provider } from 'mobx-react'
import UserStore from './stores/UserStore'
import RegisterTokenStore from './stores/RegisterTokenStore'
import DeviceStore from './stores/DeviceStore'

import UserProfileWrapper from './components/UserProfileWrapper.js'
import UserDevices from './components/UserDevices.js'
import ThemeChooser from './components/ThemeChooser.js'
import Footer from './components/Footer.js'
import RegisterTokenList from './components/RegisterTokenList.js'
import RegisterTokenAdd from './components/RegisterTokenAdd.js'
import UserList from './components/UserList.js'
import UserAdd from './components/UserAdd.js'
import ServerInformation from './components/ServerInformation.js'

/* eslint-disable-next-line */
import { getStorage, getStorageObject, setStorage, setStorageObject } from './util/storage.js'
import { testIfJwtWorks, testIfRefreshTokenWorks, toggleTheme, redirectToLogin } from './util/util.js'

Modal.setAppElement('#root')

class App extends Component {

  state = {
    logged_in: false,
    userObject: JSON.parse(getStorage('user') || '{}')
  }

  constructor(props) {

    super(props)

    if(window.ENVIRONMENT === 'dev') { // INFO: change when using .env to set jwt / refreshToken (dev)
      setStorage('jwt', window.REACT_APP_JWT)
      setStorage('refreshToken', window.REACT_APP_REFRESH_TOKEN)
    }

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

          <Provider UserStore={UserStore} RegisterTokenStore={RegisterTokenStore} DeviceStore={DeviceStore}>
            <ToastProvider timeout={2000}>

              {this.state.logged_in ? (
                <div className="index main">

                  <div className="wrapper">

                    <div className="heading-sub"><Intl word="your_information" /></div>

                    <UserProfileWrapper />

                    <div className="devices-wrapper">
                      
                      <UserDevices />

                    </div>

                    {this.state.userObject.account_type === 'admin' ? (
                      <div className="admin-panel-wrapper">

                      <div className="heading-sub"><Intl word="admin_interface" /></div>

                      <div className="heading-sub-small"><Intl word="register_tokens" /></div>
                      <div className="register_token-wrapper">

                        <RegisterTokenList />
                      
                      </div>

                      <div className="heading-sub-small"><Intl word="generate_register_tokens" /></div>
                      <div className="add_register_token-wrapper">

                        <RegisterTokenAdd />

                      </div>
            
                      <div className="heading-sub-small"><Intl word="list_modify_users" /></div>
                      <div className="list_user-wrapper">

                        <UserList />
            
                      </div>

                      <div className="heading-sub-small"><Intl word="add_user" /></div>
                      <div className="add_user-wrapper">

                        <UserAdd />
            
                      </div>

                      <div className="heading-sub-small"><Intl word="server_information" /></div>

                      <ServerInformation />
            
                    </div>
                    ) : null}

                  </div>

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