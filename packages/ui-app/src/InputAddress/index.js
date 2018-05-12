// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringOptions, KeyringOption$Type } from '@polkadot/ui-keyring/types';
import type { BareProps } from '../types';

import './InputAddress.css';

import React from 'react';

import keyring from '@polkadot/ui-keyring/src';
import createOptionHeader from '@polkadot/ui-keyring/src/options/header';
import addressDecode from '@polkadot/util-keyring/address/decode';

import Dropdown from '../Dropdown';
import addressToAddress from './addressToAddress';

type Props = BareProps & {
  defaultValue?: string | Uint8Array,
  hideAddress?: boolean;
  isError?: boolean,
  isInput?: boolean,
  label?: string,
  onChange: (value: Uint8Array) => void,
  type?: KeyringOption$Type,
  value?: string | Uint8Array
};

type State = {
  defaultValue: ?string;
  value: ?string;
}

const RECENT_KEY = 'header-recent';

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

    this.state = {
      defaultValue: addressToAddress(props.defaultValue),
      value: addressToAddress(props.value)
    };
  }

  static getDerivedStateFromProps ({ value }: Props): $Shape<State> {
    return {
      value: addressToAddress(value)
    };
  }

  render (): React$Node {
    const { className, hideAddress = false, isError, label, onChange, style, type = 'all' } = this.props;
    const { defaultValue, value } = this.state;
    const options = keyring.getOptions(type);

    return (
      <Dropdown
        className={['ui--InputAddress', hideAddress ? 'flag--hideAddress' : '', className].join(' ')}
        defaultValue={defaultValue}
        isError={isError}
        label={label}
        onChange={onChange}
        options={options}
        search={this.onSearch}
        style={style}
        transform={transform}
        value={value}
      />
    );
  }

  onSearch = (filteredOptions: KeyringOptions, query: string): KeyringOptions => {
    const { isInput = true } = this.props;
    const queryLower = query.toLowerCase();
    const matches = filteredOptions.filter((item) => {
      // $FlowFixMe yes, this is how we check for Element (??!)
      if (!item || !item.value) {
        return true;
      }

      // $FLowFixMe we should now have value elements
      const { name, value } = item;
      const hasMatch = name.toLowerCase().indexOf(queryLower) !== -1 ||
      value.toLowerCase().indexOf(queryLower) !== -1;

      return hasMatch;
    });

    // $FlowFixMe yes, this is how we check for Element
    const valueMatches = matches.filter((item) => item.value);

    // see if we should add a new item, i.e. no valid address found
    if (isInput && valueMatches.length === 0) {
      const publicKey = transform(query);

      if (publicKey.length === 32) {
        if (!matches.find((item) => item.key === RECENT_KEY)) {
          matches.push(
            createOptionHeader('Recent')
          );
        }

        matches.push(
          keyring.saveRecent(query)
        );
      }
    }

    return matches.filter((item, index) => {
      if (!item) {
        return false;
      }

      const isLast = index === matches.length - 1;
      const nextItem = matches[index + 1];
      // $FlowFixMe yes, this is how we check for Element
      const hasNext = nextItem && nextItem.value;

      // $FlowFixMe yes, this is how we check for Element
      if (item.value || (!isLast && hasNext)) {
        return true;
      }

      return false;
    });
  };
}
