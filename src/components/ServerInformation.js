import React, { Component } from 'react'

import { inject, observer } from 'mobx-react'

import { intl } from './Intl.js'
import { time_ago, format_date } from '../util/date.js'
import { getServerVersion, getServerUptime } from '../util/util.js'
import { version } from '../../package.json'

const Block = ({ name, value, tooltip }) => (
  <div className="user-profile-field-block" style={{ width: 184, display: "inline-block", margin: 8, textAlign: "left" }}>
    <label className="user-profile-label" htmlFor={"server-information-" + name}>{name}</label>
    <div className={"user-profile-field"} id={"server-information-" + name}><span {...(tooltip ? { "tooltip-top": tooltip } : {})}>{value}</span></div>
  </div>
)

class ServerInformation extends Component {

  constructor() {
    super()
    this.state = {
      uptime: null,
      version: null
    }
  }

  componentDidMount() {
    getServerVersion().then(version => this.setState({ version }))
    getServerUptime().then(uptime => this.setState({ uptime }))
  }

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <Block name={intl("uptime")} value={this.state.uptime && format_date(this.state.uptime, false)} tooltip={this.state.uptime && time_ago(this.state.uptime)} />
        <Block name={intl("user_count")} value={this.props.UserStore.users.length} />
        <Block name={intl("server_version")} value={this.state.version} />
        <Block name={intl("client_version")} value={version} />
      </div>
    )
  }
}

export default inject('UserStore')(observer(ServerInformation))