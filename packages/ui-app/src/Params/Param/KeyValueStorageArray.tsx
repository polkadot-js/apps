// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyValue } from '@polkadot/params/types';
import { Props } from '../types';

import React from 'react';
import u8aToUtf8 from '@polkadot/util/u8a/toUtf8';
import toU8a from '@polkadot/util/u8a/toU8a';

import BytesFile from './File';

export default class KeyValueStorageArray extends React.PureComponent<Props> {
  render () {
    const { className, isDisabled, isError, label, style, withLabel } = this.props;

    return (
      <BytesFile
        className={className}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        onChange={this.onChange}
        style={style}
        withLabel={withLabel}
      />
    );
  }

  onChange = (raw: Uint8Array): void => {
    const { onChange } = this.props;
    let value: KeyValue[] = [];

    try {
      const json = JSON.parse(u8aToUtf8(raw));

      value = Object.keys(json).map((key) => ({
        key: toU8a(key),
        value: toU8a(json[key])
      }));
    } catch (error) {
      // ignore, handled via empty case
      console.error('Error parsing json', error);
    }

    onChange({
      isValid: value.length !== 0,
      value: []
    });
  }
}
