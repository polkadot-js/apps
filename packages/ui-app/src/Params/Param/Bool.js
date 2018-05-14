// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props } from '../types';

import React from 'react';

import Dropdown from '../../Dropdown';
import Bare from './Bare';

const options = [
  { text: 'No', value: false },
  { text: 'Yes', value: true }
];

export default class Bool extends React.PureComponent<Props> {
  render (): React$Node {
    const { className, isDisabled, isError, label, style, value: { options: { initValue = false } = {} }, withLabel } = this.props;

    return (
      <Bare
        className={className}
        style={style}
      >
        <Dropdown
          className='small'
          isDisabled={isDisabled}
          isError={isError}
          defaultValue={initValue}
          label={label}
          options={options}
          onChange={this.onChange}
          withLabel={withLabel}
        />
      </Bare>
    );
  }

  onChange = (value: boolean): void => {
    const { index, onChange } = this.props;

    onChange(index, {
      isValid: true,
      value
    });
  }
}
