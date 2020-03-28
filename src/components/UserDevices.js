import React, { Component } from 'react'

import { Intl, intl } from './Intl.js'


class UserDevices extends Component {


  render() {

    return (
      <div>

      </div>
    )
  }
}

export default withToast(inject('UserStore')(inject('DeviceStore')((observer(UserDevices)))))