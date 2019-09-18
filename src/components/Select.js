import React, { Component } from 'react'
import RcSelect, { Option, OptGroup } from 'rc-select'

import './select.css'

class Select extends Component {
  static defaultProps = {
    prefixCls: 'select',
    showSearch: false,
    transitionName: 'slide-up',
    choiceTransitionName: 'zoom',
  }

  rcSelect = null

  focus = () => {
    this.rcSelect.focus();
  }

  blur = () => {
    this.rcSelect.blur();
  }

  saveSelect = (node) => {
    this.rcSelect = node;
  }

  render() {
    const { prefixCls, className = '', size, mode, ...restProps } = this.props;

    const cls = className + (
        size === 'large' ? ` ${prefixCls}-lg` : ''
      ) + (
        size === 'small' ? ` ${prefixCls}-sm` : ''
      )

    let { optionLabelProp } = this.props

    const modeConfig = {
      multiple: mode === 'multiple',
      tags: mode === 'tags'
    }

    // const inputIcon = ( <Icon type="down" className={`${prefixCls}-arrow-icon`} /> )
    // const removeIcon = ( <Icon type="close" className={`${prefixCls}-remove-icon`} /> )
    // const clearIcon = ( <Icon type="close-circle" theme="filled" className={`${prefixCls}-clear-icon`} /> )
    // const menuItemSelectedIcon = ( <Icon type="check" className={`${prefixCls}-selected-icon`} /> )

    return (
      <RcSelect
        // inputIcon={inputIcon}
        // removeIcon={removeIcon}
        // clearIcon={clearIcon}
        // menuItemSelectedIcon={menuItemSelectedIcon}
        {...restProps}
        {...modeConfig}
        prefixCls={prefixCls}
        className={cls}
        optionLabelProp={optionLabelProp || 'children'}
        ref={this.saveSelect}
      />
    )
  }
}

export {
  Option, OptGroup
}

export default Select