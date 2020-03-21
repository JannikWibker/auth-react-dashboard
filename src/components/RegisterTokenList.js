import React, { Component } from 'react'

import { listRegisterTokens, invalidateRegisterToken } from '../util/util.js'
import copyToClipboard from '../util/copy-to-clipboard.js'

import { intl, Intl } from './Intl.js'
import ShareIcon from './icons/Share.js'
import XIcon from './icons/X.js'
import RefreshCWIcon from './icons/RefreshCW.js'

import { withToast } from 'react-awesome-toasts'

class RegisterTokenList extends Component {

  state = {
    register_tokens: [],
    loading: false
  }

  constructor(props) {
    super(props)

    this.updateRegisterTokenState()
  }

  updateRegisterTokenState = () => {
    this.setState({ loading: true })
    listRegisterTokens((err, json) => {
      if(err) {
        console.log(err, json)
        this.props.toast.show({
          text: intl('something_went_wrong') + ' (RegisterToken)',
          actionText: intl('close'),
          onActionClick: this.props.toast.hide
        })
        this.setState({ loading: false })
      } else {
        console.log(json)
        this.setState({
          register_tokens: Object.keys(json.register_tokens).map(key => ({ key: key, token: json.register_tokens[key].register_token, metadata: json.register_tokens[key].metadata })),
          loading: false
        })
      }
    }, true)
  }

  invalidateRegisterToken = (id) => {
    invalidateRegisterToken(id, (err, res) => {
      if(err) {
        console.log(err, res)
        this.props.toast.show({
          text: intl('something_went_wrong') + ' (RegisterToken)',
          actionText: intl('close'),
          onActionClick: this.props.toast.hide
        })
      } else {
        console.log(res)
        this.updateRegisterTokenState()
      }
    })
  }

  render() {
    console.log(this.state, this.state.loading)
    return (
      <table className="editable-table">
        <thead>
          <tr className="register-token-heading-row">
            <th className="table-heading"><Intl word="id" /></th>
            <th className="table-heading"><Intl word="register_token" /></th>
            <th className="table-heading"><Intl word="account_type" /></th>
            <th className="table-heading"><Intl word="creation_date" /></th>
            <th className="table-heading"><Intl word="invalidate" /></th>
            <th className="table-heading"><div className="refresh-wrapper" onClick={this.updateRegisterTokenState}>
              <RefreshCWIcon tooltip-top={intl('update')} width={16} height={16} className={this.state.loading ? 'loading' : ''} />
            </div></th>
          </tr>
        </thead>
        <tbody>
          {this.state.register_tokens.map(({ key, token, metadata }) => (
            <tr key={key}>
              <td className="table-data"><div className="table-cell-wrapper">{key}</div></td>
              <td className="table-data"><div className="table-cell-wrapper copy-adjust">{token}</div><div className="copy-wrapper" onClick={() => copyToClipboard(token)}><ShareIcon width={16} height={16} /></div></td>
              <td className="table-data"><div className="table-cell-wrapper">{metadata.account_type}</div></td>
              <td className="table-data"><div className="table-cell-wrapper">{metadata.formatted_timestamp.replace('@', ' ')}</div></td>
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

export default withToast(RegisterTokenList)