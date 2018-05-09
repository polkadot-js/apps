// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '../types';
import type { KeyringOptions } from './types';

import './InputAddress.css';

import React from 'react';
import addressDecode from '@polkadot/util-keyring/address/decode';
import addressEncode from '@polkadot/util-keyring/address/encode';

import RxDropdown from '../RxDropdown';
import createItem from './optionItem';
import createOptions from './options';

type Props = BareProps & {
  defaultValue?: Uint8Array,
  isError?: boolean,
  isInput?: boolean,
  label?: string,
  onChange: (value: Uint8Array) => void,
  options?: KeyringOptions,
  withInput?: boolean
};

const transform = (value: string): Uint8Array => {
  try {
    return addressDecode(value);
  } catch (error) {
    return new Uint8Array([]);
  }
};

export default function InputAddress ({ className, defaultValue, isError, isInput = false, label, onChange, options, style }: Props): React$Node {
  const _options = options || createOptions(isInput);
  const onSearch = (filteredOptions: KeyringOptions, query: string): KeyringOptions => {
    const queryLower = query.toLowerCase();
    const matches = filteredOptions.filter((item) => {
      const { name, value } = item;
      const isManual = item['data-manual'] || false;
      const hasMatch = name.toLowerCase().indexOf(queryLower) !== -1 ||
      value.toLowerCase().indexOf(queryLower) !== -1;

      return hasMatch && (isInput || !isManual);
    });

    // see if we should add a new item, i.e. valid address found
    if (isInput && matches.length === 0) {
      const publicKey = transform(query);

      if (publicKey.length === 32) {
        const newOption = createItem(query, `${query.slice(0, 16)}…`, true);

        matches.push(newOption);
        _options.push(newOption);
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
      options={_options}
      search={onSearch}
      transform={transform}
    />
  );
}
