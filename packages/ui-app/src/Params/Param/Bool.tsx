// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Props } from '../types';

import React from 'react';

import Dropdown from '../../Dropdown';
import Bare from './Bare';

const options = [
  { text: 'No', value: false },
  { text: 'Yes', value: true }
];

export default class Bool extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue: { value }, isDisabled, isError, label, style, withLabel } = this.props;
    const defaultValue = value as boolean;

    return (
      <Bare
        className={className}
        style={style}
      >
        <Dropdown
          className={isDisabled ? 'full' : 'small'}
          defaultValue={defaultValue}
          isDisabled={isDisabled}
          isError={isError}
          label={label}
          options={options}
          onChange={this.onChange}
          withLabel={withLabel}
        />
      </Bare>
    );
  }

  onChange = (value: boolean): void => {
    const { onChange } = this.props;

    onChange && onChange({
      isValid: true,
      value
    });
  }
}
