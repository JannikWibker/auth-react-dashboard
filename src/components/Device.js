import React, { Component } from 'react'

import { Intl, intl } from './Intl.js'

import IconX from './icons/X.js'
import ChevronDown from './icons/chevron-down.js'
import ChevronUp from './icons/chevron-up.js'

import { formatDate } from '../util/util.js'
import { getStorage } from '../util/storage.js'

const RenderIpInformation = ({ ip, ip_information, uuid }) => {
  if(ip_information.is_internal) {
    return (
      <div className="device_ip_information">
        <div style={{marginLeft: 1}}>
          <span className="device_ip">{ip}</span>
          <span className="device_ip_internal_notice"> <Intl word="internal_ip_notice" /></span>
        </div>
        <table className="device_ip_information_table">
          <tbody>
            <tr><td><Intl word="device_id" /></td><td>{uuid}</td></tr>
          </tbody>
        </table>
      </div>
    )
  } else {
    return (
      <div className="device_ip_information">
        <table className="device_ip_information_table">
          <tbody>
            <tr><td>{ip.length > 20 ? ip.substring(0, 20) + '…' : ip}</td></tr>
            <tr><td><Intl word="region" /></td><td>{ip_information.continent}, {ip_information.country}, {ip_information.region}</td></tr>
            <tr><td><Intl word="city" /></td><td>{ip_information.city} ({ip_information.zip})</td></tr>
            <tr><td>Lat./Long.</td><td>
              <a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${ip_information.latitude},${ip_information.longitude}`}>{ip_information.latitude}, {ip_information.longitude}</a> (<Intl word="approximation" />)
            </td></tr>
            <tr><td><Intl word="isp" /></td><td>{ip_information.isp}</td></tr>
            <tr><td><Intl word="device_id" /></td><td>{uuid}</td></tr>
          </tbody>
        </table>
      </div>
    )
  }
}


class Device extends Component {
  constructor(props) {
    super(props)

    this.state = {
      icon_src: this.onThemeChange(),
      expanded: false
    }    
  }

  componentWillReact() {
    this.setState({
      icon_src: this.onThemeChange()
    })
  }

  onToggleExpanded = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  onRevoke = () => {
    this.props.revoke()
  }

  onThemeChange() {

    let icon_src

    switch(this.props.device.parsed_user_agent.formfactor) {
      case 'Desktop': // handle this somehow (there is no UIStore in this project)
        icon_src = getStorage('theme') === 'dark' ? '/icons/desktop-dark-mode.png' : '/icons/desktop-light-mode.png'
        break;
      case 'Mobile':
        icon_src = '/icons/mobile.png'
        break;
      case 'Bot':
        icon_src = '/icons/bot.png'
        break;
      default:
        icon_src = '/icons/unknown.png'
    }
    return icon_src
  }

  render() {

    const { device_id: uuid, ip, parsed_user_agent, creation_date, last_used, ip_information, is_revoked } = this.props.device

    return (
      <div className={"device" + (this.state.expanded ? ' expanded' : '') + (ip_information.is_internal ? ' internal' : '')}>
      <div className="device_wrapper">
        <div className="device_formfactor_icon">
          <img src={this.state.icon_src} alt={parsed_user_agent.formfactor}/>
        </div>
        <div className="device_information_wrapper">

          <div className="device_platform">
            {parsed_user_agent.platform}
            {uuid === this.props.current_device_uuid ? (<div className="device_this_device_tag"><Intl word="this_device" /></div>) : null}
          </div>

          <div className="device_information_row">
            <span className="device_browser">{parsed_user_agent.browser}</span>

            <div className="device_dates">
              <span className="device_last_used"><Intl word="last_used" />: <span>{formatDate(new Date(last_used))}</span></span>
              <span className="device_creation_date"><Intl word="date_added" />: <span>{formatDate(new Date(creation_date))}</span></span>
            </div>

            {this.state.expanded ? (
              <RenderIpInformation ip={ip} ip_information={ip_information} uuid={uuid} />
            ) : (
            <div className="device_ip">{ip}</div>
            )}
          </div>

          </div>
          <div className="device_actions">
            {is_revoked ? null : (
              <div className="device_revoke" tooltip-left={intl('revoke')} onClick={this.onRevoke}>
                <IconX />
              </div>
            )}
            <div className="device_expand" tooltip-left={this.state.expanded ? intl('minimize') : intl('expand')} onClick={this.onToggleExpanded}>
              {this.state.expanded 
                ? <ChevronUp />
                : <ChevronDown />
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Device