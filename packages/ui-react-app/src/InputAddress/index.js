// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringOptions, KeyringOption$Type } from '@polkadot/ui-keyring/types';
import type { BareProps } from '../types';

import './InputAddress.css';

import React from 'react';
import keyring from '@polkadot/ui-keyring/src';
import addressDecode from '@polkadot/util-keyring/address/decode';
import addressEncode from '@polkadot/util-keyring/address/encode';

import RxDropdown from '../RxDropdown';

type Props = BareProps & {
  defaultValue?: Uint8Array,
  isError?: boolean,
  isInput?: boolean,
  label?: string,
  onChange: (value: Uint8Array) => void,
  type?: KeyringOption$Type
};

const transform = (value: string): Uint8Array => {
  try {
    return addressDecode(value);
  } catch (error) {
    return new Uint8Array([]);
  }
};

export default function InputAddress ({ className, defaultValue, isError, isInput = true, label, onChange, style, type = 'all' }: Props): React$Node {
  const options = keyring.getOptions(type);
  const onSearch = (filteredOptions: KeyringOptions, query: string): KeyringOptions => {
    const queryLower = query.toLowerCase();
    const matches = filteredOptions.filter((item) => {
      // flowlint-next-line sketchy-null-string:off
      if (!item.key) {
        return false;
      }

      const { name, value } = item;
      // const isRecent = item['data-is-recent'] || false;
      const hasMatch = name.toLowerCase().indexOf(queryLower) !== -1 ||
      value.toLowerCase().indexOf(queryLower) !== -1;

      return hasMatch; // && (isInput || !isRecent);
    });

    // see if we should add a new item, i.e. valid address found
    if (isInput && matches.length === 0) {
      const publicKey = transform(query);

      if (publicKey.length === 32) {
        matches.push(
          keyring.saveRecent(query)
        );
      }
    }

    return matches;
  };

  return (
    <RxDropdown
      className={['ui--InputAddress', className].join(' ')}
      defaultValue={defaultValue && addressEncode(defaultValue)}
      isError={isError}
      label={label}
      onChange={onChange}
      options={options}
      search={onSearch}
      transform={transform}
    />
  );
}
