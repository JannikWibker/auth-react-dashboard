import { observable, action, decorate } from 'mobx'

// import parse_ua from '../util/simplify-user_agent.js' // TODO: doesn't exist in this project, could simply copy it over but it is a really large file
import { getStorage } from '../util/storage.js'
import { getAllUserDevices, revokeUserDevice } from '../util/util.js'

class DeviceStore {

  current_device = getStorage('device_id')

  devices = observable.array()

  loadDevices = () => {
    // maybe bad pattern, but recomputing current_device when something happens
    if(!this.current_device) this.current_device = getStorage('device_id')

    return getAllUserDevices()
      .then(({ message, devices }) => {
        const transformedDevices = []
        for(let i = 0; i < devices.length; i++) {
          transformedDevices[i] = {
            ...devices[i],
            raw_user_agent: devices[i].user_agent,
            // user_agent: parse_ua(devices[i].user_agent), // TODO: see above
            ip_information: devices[i].ip_information
          }
        }
        this.devices = transformedDevices
      })
  }
  
  revokeDevice = (device_id) => {
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
