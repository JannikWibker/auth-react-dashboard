import React, { Component } from 'react'

import { Intl, intl } from './Intl.js'

import Modal from 'react-modal'

import { inject, observer } from 'mobx-react'
import { withToast } from 'react-awesome-toasts'

import Device from './Device.js'

const ConfirmModal = ({ open, close, component }) => (
  <Modal
    isOpen={open}
    contentLabel="Confirm Modal"
    className="confirm-modal"
    overlayClassName="confirm-modal-overlay"
    onRequestClose={close}
    shouldCloseOnOverlayClick={true}>
    {typeof component === 'function' ? component(close) : component }
  </Modal>
)

const setModal = (scope, { confirm_modal_open, confirm_modal_component }) => scope.setState(Object.assign({
  confirm_modal_open: scope.confirm_modal_open,
  confirm_modal_component: scope.confirm_modal_component
}, {
  confirm_modal_open,
  confirm_modal_component
}))

class UserDevices extends Component {

  constructor(props) {
    super(props)
    props.DeviceStore.loadDevices()
    this.state = {
      confirm_modal_open: false,
      confirm_modal_component: null
    }
  }

  setModal = setModal.bind(this, this)

  onRevokeCurrentDeviceConfirmation(close) {
    this.props.DeviceStore.revokeDevice(this.props.DeviceStore.current_device)
  }

  onRevokeDevice(device_id) {
    if(this.props.DeviceStore.current_device === device_id) {
      this.setModal(this, {
        confirm_modal_open: true,
        confirm_modal_component: (close) => (
          <div className="confirm-modal-wrapper">
            <div className="confirm-modal-text">
              <Intl word="revoke_current_device" />
            </div>
            <div className="confirm-modal-btn-wrapper">
              <button className="btn btn-normal" onClick={close}><Intl word="cancel" /></button>
              <button className="btn btn-normal btn-red" onClick={this.onRevokeCurrentDeviceConfirmation.bind(this, close)}><Intl word="logout" /></button>
            </div>
          </div>
        )
      })
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
      .then(close)
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
    .then(close)
    .then(() => this.props.toast.show({
      text: intl('logout_everywhere_count').replace('$$', device_count),
      actionText: intl('close'),
      onActionClick: this.props.toast.hide
    }))

  }

  onRevokeAllDevices = (e) => {
    this.setModal({
      confirm_modal_open: true,
      confirm_modal_component: (close) => (
        <div className="confirm-modal-wrapper">
          <div className="confirm-modal-text">
            <Intl word="logout_everywhere_notice" />
          </div>
          <div className="confirm-modal-btn-wrapper">
            <button className="btn btn-normal" onClick={close}><Intl word="cancel" /></button>
            <button className="btn btn-normal btn-red" onClick={this.onRevokeAllDevicesExcludingCurrent.bind(this, close)}><Intl word="logout_everywhere_exclusive" /></button>
            <button className="btn btn-normal btn-red" onClick={this.onRevokeAllDevicesIncludingCurrent.bind(this, close)}><Intl word="logout_everywhere_inclusive" /></button>
          </div>
        </div>
      )
    })

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

        <ConfirmModal open={this.state.confirm_modal_open} close={() => this.setState({ confirm_modal_open: false })} component={this.state.confirm_modal_component} />

      </div>
    )
  }
}

export default withToast(inject('UserStore')(inject('DeviceStore')((observer(UserDevices)))))