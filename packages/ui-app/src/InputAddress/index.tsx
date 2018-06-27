// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringOptions, KeyringOption$Type } from '@polkadot/ui-keyring/types';
import { BareProps } from '../types';

import './InputAddress.css';

import React from 'react';

import keyring from '@polkadot/ui-keyring/index';
import createOptionHeader from '@polkadot/ui-keyring/options/header';
import addressDecode from '@polkadot/util-keyring/address/decode';

import Dropdown from '../Dropdown';
import classes from '../util/classes';
import addressToAddress from './addressToAddress';

type Props = BareProps & {
  defaultValue?: string | Uint8Array | null,
  hideAddress?: boolean;
  isDisabled?: boolean,
  isError?: boolean,
  isInput?: boolean,
  label?: string,
  onChange: (value: Uint8Array) => void,
  placeholder?: string,
  type?: KeyringOption$Type,
  value?: string | Uint8Array,
  withLabel?: boolean
};

type State = {
  defaultValue: string | undefined,
  options: KeyringOptions,
  value?: string
};

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
      defaultValue: addressToAddress(props.defaultValue as string)
    } as State;
  }

  static getDerivedStateFromProps ({ value }: Props): State | null {
    try {
      return {
        value: addressToAddress(value) || undefined
      } as State;
    } catch (error) {
      return null;
    }
  }

  render () {
    const { className, hideAddress = false, isDisabled = false, isError, label, onChange, type = 'all', style, withLabel } = this.props;
    const { defaultValue, value } = this.state;
    const options = keyring.getOptions(type);

    return (
      <Dropdown
        className={classes('ui--InputAddress', hideAddress ? 'flag--hideAddress' : '', className)}
        defaultValue={
          value !== undefined
            ? undefined
            : defaultValue
        }
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        onChange={onChange}
        onSearch={this.onSearch}
        options={options}
        style={style}
        transform={transform}
        value={value}
        withLabel={withLabel}
      />
    );
  }

  onSearch = (filteredOptions: KeyringOptions, query: string): KeyringOptions => {
    const { isInput = true } = this.props;
    const queryLower = query.toLowerCase();
    const matches = filteredOptions.filter((item) => {
      if (item.value === null) {
        return true;
      }

      const { name, value } = item;
      const hasMatch = name.toLowerCase().indexOf(queryLower) !== -1 ||
      value.toLowerCase().indexOf(queryLower) !== -1;

      return hasMatch;
    });

    const valueMatches = matches.filter((item) => item.value !== null);

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
      const isLast = index === matches.length - 1;
      const nextItem = matches[index + 1];
      const hasNext = nextItem && nextItem.value;

      if (item.value !== null || (!isLast && hasNext)) {
        return true;
      }

      return false;
    });
  }
}
