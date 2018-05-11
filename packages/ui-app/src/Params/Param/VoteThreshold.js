// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow
// flowlint sketchy-null-mixed:off

import type { Props } from '../types';

import React from 'react';

import Dropdown from '../../Dropdown';
import Bare from './Bare';

const options = [
  { text: 'Super majority approval', value: 0 },
  { text: 'Super majority rejection', value: 1 },
  { text: 'Simple majority', value: 2 }
];

export default class VoteThreshold extends React.PureComponent<Props> {
  render (): React$Node {
    const { className, label, style, value: { options: { initValue = 0 } = {} } } = this.props;
    const defaultValue = initValue || 0;

    return (
      <Bare
        className={className}
        style={style}
      >
        <Dropdown
          className='small'
          defaultValue={defaultValue}
          label={label}
          options={options}
          onChange={this.onChange}
        />
      </Bare>
    );
  }

  onChange = (value: number): void => {
    const { index, onChange } = this.props;

    onChange(index, {
      isValid: true,
      value
    });
  }
}
