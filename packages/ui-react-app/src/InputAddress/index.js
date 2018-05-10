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

type State = {
  defaultValue?: string;
}

const transform = (value: string): Uint8Array => {
  try {
    return addressDecode(value);
  } catch (error) {
    return new Uint8Array([]);
  }
};

// NOTE: We are not extending Component here since the options may change in the keyring (which needs a re-render), however the input props will be the same (so, no PureComponent with shallow compare here)
export default class InputAddress extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props);

    let defaultValue;

    if (props.defaultValue) {
      try {
        defaultValue = addressEncode(props.defaultValue);
      } catch (error) {
        console.error('Unable to encode defaultValue address', props.defaultValue);
      }
    }

    this.state = {
      defaultValue
    };
  }

  render (): React$Node {
    const { className, isError, label, onChange, style, type = 'all' } = this.props;
    const { defaultValue } = this.state;
    const options = keyring.getOptions(type);

    return (
      <RxDropdown
        className={['ui--InputAddress', className].join(' ')}
        defaultValue={defaultValue}
        isError={isError}
        label={label}
        onChange={onChange}
        options={options}
        search={this.onSearch}
        style={style}
        transform={transform}
      />
    );
  }

  onSearch = (filteredOptions: KeyringOptions, query: string): KeyringOptions => {
    const { isInput = true } = this.props;
    const queryLower = query.toLowerCase();
    const matches = filteredOptions.filter((item) => {
      // flowlint-next-line sketchy-null-string:off
      if (!item.key) {
        return false;
      }

      const { name, value } = item;
      const hasMatch = name.toLowerCase().indexOf(queryLower) !== -1 ||
      value.toLowerCase().indexOf(queryLower) !== -1;

      return hasMatch;
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
}
