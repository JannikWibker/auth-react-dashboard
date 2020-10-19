import { observable, action, decorate } from 'mobx'

import { getStorage } from '../util/storage.js'
import { getAllUserDevices, revokeUserDevice } from '../util/util.js'

class DeviceStore {

  current_device = getStorage('device_id')

  devices = observable.array()

  loadDevices = () => {
    // maybe bad pattern, but recomputing current_device when something happens
    if(!this.current_device) this.current_device = getStorage('device_id')

    return getAllUserDevices()
      .then(({ devices }) => {
        this.devices = devices
      })
  }
  
  revokeDevice = device_id => {
    return revokeUserDevice(device_id)
      .then(json => json.status === 'success'
        ? Promise.resolve(this.loadDevices())
        : Promise.reject({ message: json.message, status: json.status }))
  }
}

decorate(DeviceStore, {
  devices: observable,
  loadDevices: action,
  revokeDevice: action,
})

const deviceStore = new DeviceStore()

export default deviceStore
