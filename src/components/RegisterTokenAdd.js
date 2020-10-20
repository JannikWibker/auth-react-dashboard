import React, { Component } from 'react'

import { inject, observer } from 'mobx-react'
import { withToast } from 'react-awesome-toasts'

import Select, { Option } from './Select.js'
import Checkbox from './Checkbox.js'
import { Intl, intl } from './Intl.js'

import { account_types } from '../stores/UserStore.js'

const METADATA_DEFAULT = '{}'
const EXPIRE_AT_DEFAULT = 0
const USAGE_COUNT_DEFAULT = 1

class RegisterTokenAdd extends Component {

  el = {
    metadata: React.createRef(),
    expire_at: React.createRef(),
    usage_count: React.createRef(),
  }

  state = {
    account_type: undefined,
    reusable: false
  }

  addRegisterToken = () => {
    let metadata
    try {
      metadata = JSON.parse(this.el.metadata.current.value)
    } catch(err) {
      return this.props.toast.show({
        text: intl('error') + ' - ' + intl('malformed_json'),
        actionText: intl('close'),
        onActionClick: this.props.toast.hide
      })
    }
    const values = {
      account_type: this.state.account_type,
      metadata: metadata,
      expire_at: +this.el.expire_at.current.value * 1000, // from ms to seconds
      permanent: this.state.reusable,
      usage_count: +this.el.usage_count.current.value,
    }
    console.log(values)

    this.props.RegisterTokenStore.generateRegisterToken(values)
  }

  updateAccountType = (account_type = account_types[0]) => {
    this.setState({ 
      account_type: account_type,
    })
  }

  updateIsReusable = (is_reusable) => {
    this.setState({
      reusable: is_reusable
    })
  }

  clearInput = () => {
    this.el.metadata.current.value = METADATA_DEFAULT
    this.el.expire_at.current.value = EXPIRE_AT_DEFAULT
    this.el.usage_count.current.value = USAGE_COUNT_DEFAULT
    this.setState({
      account_type: undefined,
      reusable: false
    })
  }

  render() {
    return (
      <div className="register_token-add">
        <form>
          <div className="user-profile-group-horizontal">
            <div className="user-profile-field-block">
              <label className="user-profile-label" htmlFor="register_token-add-account_type"><Intl word="account_type" /></label><br />
              <Select value={this.state.account_type} style={{ width: 152, height: 32 }} onChange={this.updateAccountType} placeholder={intl('account_type')}>
                {account_types.map((type, i) => (
                  <Option key={i} value={type}>{type}</Option>
                ))}
              </Select>
            </div>
            <div className="user-profile-field-block">
              <label className="user-profile-label" htmlFor="register_token-add-expire_at"><Intl word="expire_at" /> (<Intl word="seconds" />)</label>
              <input id="register_token-add-expire_at" ref={this.el.expire_at} autoComplete={'off'} className="text-input input-small user-add-input" defaultValue={EXPIRE_AT_DEFAULT} type="number" min={0} step={60} />
            </div>
          </div>

          <div className="user-profile-group-horizontal">
            <div className="user-profile-field-block">
              <label className="user-profile-label" htmlFor="register_token-add-metadata"><Intl word="metadata" /></label>
              <input id="register_token-add-metadata" ref={this.el.metadata} autoComplete={'off'} className="text-input input-small user-add-input monospace-input" defaultValue={METADATA_DEFAULT} />
            </div>
          </div>

          <div className="user-profile-group-horizontal">
            <div className="user-profile-field-block">
              <label className="user-profile-label" htmlFor="register_token-add-usage_count"><Intl word="usage_count" /></label>
              <input id="register_token-add-usage_count" ref={this.el.usage_count} autoComplete={'off'} className="text-input input-small user-add-input" defaultValue={USAGE_COUNT_DEFAULT} type="number" min={1} {...(this.state.reusable ? {disabled: true} : {})} />
            </div>
            <div className="user-profile-field-block">
              <label className="user-profile-label" htmlFor="register_token-add-reusable"><Intl word="reusable" /></label><br />
              <div style={{marginTop: 4, marginLeft: 6}}>
                <Checkbox checked={this.state.reusable} onChange={event => this.updateIsReusable(event.target.checked)}>{intl(this.state.reusable ? 'reusable' : 'not_reusable')}</Checkbox>
              </div>
            </div>
          </div>

          <div className="user-profile-btn-wrapper">
            <button className="btn btn-normal btn-green" type="button" onClick={this.addRegisterToken}><Intl word="add" /></button>
            <button className="btn btn-normal" type="button" onClick={this.clearInput}><Intl word="clear" /></button>
          </div>
        </form>
      </div>
    )
  }
}

export default withToast(inject('RegisterTokenStore')(observer(RegisterTokenAdd)))