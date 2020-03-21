import React, { Component } from 'react'
import RcCheckbox from 'rc-checkbox'

import './checkbox.css'

class Checkbox extends Component {

  rcCheckbox = null

  state = {
    checked: this.props.checked || this.props.defaultChecked || false
  }

  focus() {
    this.rcCheckbox.focus()
  }

  blur() {
    this.rcCheckbox.blur()
  }

  saveCheckbox = (node) => {
    this.rcCheckbox = node
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.checked !== this.state.checked) {
      this.setState({ checked: nextProps.checked })
    }
  }

  renderCheckbox() {

    const prefixCls = 'checkbox' || this.props.prefixCls

    const checkboxProps = {
      checked: this.state.checked,
      disabled: this.props.disabled,
      onChange: (...args) => {
        if(this.props.onChange) {
          const rtn = this.props.onChange(...args)
          if(rtn === undefined || rtn === true) {
            this.setState({
              checked: !this.state.checked
            })
          }
        }
      },
    }

    const className = [
      prefixCls + '-wrapper',
      checkboxProps.checked ? (prefixCls + '-wrapper-checked') : '',
      checkboxProps.disabled ? (prefixCls + '-wrapper-disabled') : '',
    ].filter(str => str !== '').join(' ')

    return (
      <label
      className={className}
      style={this.props.style}
      onMouseEnter={this.props.onMouseEnter}
      onMouseLeave={this.props.onMouseLeave}
    >
      <RcCheckbox
        {...checkboxProps}
        prefixCls={prefixCls}
        ref={this.saveCheckbox}
      />
      {this.props.children !== undefined ? <span>{this.props.children}</span> : null}
    </label>
    )
  }

  render() {
    return this.renderCheckbox()
  }
}

export default Checkbox