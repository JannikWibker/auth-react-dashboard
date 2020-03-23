import React, { Component } from 'react'

import { inject, observer } from 'mobx-react'
import { withToast } from 'react-awesome-toasts'

import copyToClipboard from '../util/copy-to-clipboard.js'
import { capitalize } from '../util/util.js'

import { intl, Intl } from './Intl.js'
import ShareIcon from './icons/Share.js'
import XIcon from './icons/X.js'
import RefreshCWIcon from './icons/RefreshCW.js'

class RegisterTokenList extends Component {

  constructor(props) {
    super(props)
    this.updateRegisterTokenState()
  }

  updateRegisterTokenState = () => {
    this.props.RegisterTokenStore.listRegisterTokens(err => {
      if(err) {
        this.props.toast.show({
          text: intl('something_went_wrong') + ' (RegisterToken)',
          actionText: intl('close'),
          onActionClick: this.props.toast.hide
        })
      }
    })
  }

  invalidateRegisterToken = (id) => {
    this.props.RegisterTokenStore.invalidateRegisterToken(id, err => {
      if(err) {
        this.props.toast.show({
          text: intl('something_went_wrong') + ' (RegisterToken)',
          actionText: intl('close'),
          onActionClick: this.props.toast.hide
        })
      }
    })
  }

  copyToClipboard = (token) => {
    copyToClipboard(token)
    this.props.toast.show({
      text: intl('copied'),
      actionText: intl('close'),
      onActionClick: this.props.toast.hide
    })
  }

  render() {
    return (
      <table className="editable-table">
        <thead>
          <tr className="register-token-heading-row">
            <th className="table-heading"><Intl word="id" /></th>
            <th className="table-heading"><Intl word="register_token" /></th>
            <th className="table-heading"><Intl word="account_type" /></th>
            <th className="table-heading"><Intl word="metadata" /></th>
            <th className="table-heading"><Intl word="creation_date" /></th>
            <th className="table-heading">{capitalize(intl('usages_left'))}</th>
            <th className="table-heading"><Intl word="invalidate" /></th>
            <th className="table-heading"><div className="refresh-wrapper" tooltip-left={intl('refresh')} onClick={this.updateRegisterTokenState}>
              <RefreshCWIcon width={16} height={16} className={this.props.RegisterTokenStore.loading ? 'loading' : ''} />
            </div></th>
          </tr>
        </thead>
        <tbody>
          {this.props.RegisterTokenStore.register_tokens.map(({ key, token, metadata }) => (
            <tr key={key}>
              <td className="table-data"><div className="table-cell-wrapper">{key}</div></td>
              <td className="table-data"><div className="table-cell-wrapper copy-adjust">{token}</div><div className="copy-wrapper" tooltip-top={intl('copy')} onClick={() => this.copyToClipboard(token)}><ShareIcon width={16} height={16} /></div></td>
              <td className="table-data"><div className="table-cell-wrapper">{metadata.account_type}</div></td>
              <td className="table-data"><div className="table-cell-wrapper">{metadata.formatted_timestamp.replace('@', ', ')}</div></td>
              <td className="table-data"><div className="table-cell-wrapper">{JSON.stringify(metadata.metadata)}</div></td>
              <td className="table-data"><div className="table-cell-wrapper">{metadata.permanent ? intl('infinite') : metadata.usage_count}</div></td>
              <td className="table-data"><div className="table-cell-wrapper">
                <div className="invalidate-wrapper" tooltip-top={intl('invalidate')} aria-label={intl('invalidate')} onClick={() => this.invalidateRegisterToken(key)}><XIcon width={16} height={16} /></div></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}

export default withToast(inject('RegisterTokenStore')(observer(RegisterTokenList)))