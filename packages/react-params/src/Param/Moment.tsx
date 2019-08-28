// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props, RawParamOnChangeValue } from '../types';

import React from 'react';
import { Static } from '@polkadot/react-components';

import Amount from './Amount';

export default class Code extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { className, defaultValue, isDisabled, isError, label, onEnter, style, type, withLabel } = this.props;

    if (isDisabled) {
      return this.renderDisabled();
    }

    return (
      <Amount
        className={className}
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isOptional={false}
        isError={isError}
        label={label}
        onChange={this.onChange}
        onEnter={onEnter}
        style={style}
        type={type}
        withLabel={withLabel}
      />
    );
  }

  private renderDisabled (): React.ReactNode {
    const { className, defaultValue, isError, label, style, withLabel } = this.props;

    return (
      <Static
        className={className}
        defaultValue={
          (defaultValue && defaultValue.value)
            ? defaultValue.value.toString()
            : ''
        }
        isError={isError}
        label={label}
        style={style}
        withLabel={withLabel}
      />
    );
  }

  // TODO: Validate that we have actual proper WASM code
  private onChange = (value: RawParamOnChangeValue): void => {
    const { onChange } = this.props;

    onChange && onChange(value);
  }
}
