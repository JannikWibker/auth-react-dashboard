import React, { Component } from 'react'

import { Intl, intl } from './Intl.js'

import { inject, observer } from 'mobx-react'
import { withToast } from 'react-awesome-toasts'

import Device from './Device.js'

class UserDevices extends Component {

  constructor(props) {
    super(props)
    props.DeviceStore.loadDevices()
  }

  onRevokeCurrentDeviceConfirmation(close) {
    this.props.DeviceStore.revokeDevice(this.props.DeviceStore.current_device)
  }

  onRevokeDevice(device_id) {
    if(this.props.DeviceStore.current_device === device_id) {
      // TODO: ask user for confirmation, then call this.onRevokeCurrentDeviceConfirmation
    } else {
      this.props.DeviceStore.revokeDevice(device_id)
    }
  }

  onRevokeAllDevicesExcludingCurrent = (close) => {
    let device_count = 0

    this.props.DeviceStore.loadDevices()
      .then(() => {
        const devices = this.props.DeviceStore.devices
          .filter(device => !device.is_revoked && device.device_id !== this.props.DeviceStore.current_device)
        
        device_count = devices.length

        devices.forEach(device => this.props.DeviceStore.revokeDevice(device.device_id))
      })
      // .then(close) // TODO: close belongs to the modal system, cannot call this without a modal
      .then(() => this.props.toast.show({
        text: intl('logout_everywhere_count').replace('$$', device_count),
        actionText: intl('close'),
        onActionClick: this.props.toast.hide
      }))
  }

  onRevokeAllDevicesIncludingCurrent = (close) => {
    let device_count = 0

    this.props.DeviceStore.loadDevices()
    .then(() => {
      const devices = this.props.DeviceStore.devices
        .filter(device => !device.is_revoked)

      device_count = devices.length

      devices.forEach(device => this.props.DeviceStore.revokeDevice(device.device_id))
    })
    // .then(close) // TODO: close belongs to the modal system, cannot call this without a modal
    .then(() => this.props.toast.show({
      text: intl('logout_everywhere_count').replace('$$', device_count),
      actionText: intl('close'),
      onActionClick: this.props.toast.hide
    }))

  }

  onRevokeAllDevices = (e) => {
    // TODO: ask user wether to also log out the current device or leave it logged in, depending on that call this.onRevokeAllDevices(including/excluding)Current(close)
  }

  render() {

    const logged_in_devices = this.props.DeviceStore.devices.filter(device => !device.is_revoked)
    const logged_out_devices = this.props.DeviceStore.devices.filter(device => device.is_revoked)

    return (
      <div>
        <div className="heading-sub">
          <Intl word="your_devices" />
          <button onClick={this.onRevokeAllDevices} className="heading-sub-action-right"><Intl word="logout_everywhere" /></button>
        </div>
        

        <div>
          {logged_in_devices.map(device => (
              <Device
                key={device.device_id}
                device={device}
                current_device_uuid={this.props.DeviceStore.current_device}
                revoke={this.onRevokeDevice.bind(this, device.device_id)}
              />
          ))}
        </div>

        {logged_out_devices.length !== 0
          ? (
            <div className="heading-sub"><Intl word="logged_out_devices" /></div>
          ) : null
        }

        <div>
          {logged_out_devices.map(device => (
            <Device
              key={device.device_id}
              device={device}
              current_device_uuid={this.props.DeviceStore.current_device}
              revoke={this.onRevokeDevice.bind(this, device.device_id)}
            />
          ))}
        </div>

      </div>
    )
  }
}

export default withToast(inject('UserStore')(inject('DeviceStore')((observer(UserDevices)))))