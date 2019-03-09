// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringOptions, KeyringSectionOption, KeyringSectionOptions, KeyringOption$Type } from '@polkadot/ui-keyring/options/types';
import { BareProps } from '../types';

import './InputAddress.css';

import React from 'react';
import store from 'store';
import keyring from '@polkadot/ui-keyring';
import keyringOption from '@polkadot/ui-keyring/options';
import createItem from '@polkadot/ui-keyring/options/item';
import { withMulti, withObservable } from '@polkadot/ui-api/index';

import Dropdown from '../Dropdown';
import { classes } from '../util';
import addressToAddress from '../util/toAddress';

type Props = BareProps & {
  defaultValue?: string | null,
  hideAddress?: boolean;
  isDisabled?: boolean,
  isError?: boolean,
  isInput?: boolean,
  label?: string,
  onChange?: (value: string | null) => void,
  optionsAll?: KeyringOptions,
  placeholder?: string,
  type?: KeyringOption$Type,
  value?: string | Uint8Array,
  withLabel?: boolean
};

type State = {
  value?: string
};

const STORAGE_KEY = 'options:InputAddress';
const DEFAULT_TYPE = 'all';

const transformToAccountId = (value: string): string | null => {
  if (!value) {
    return null;
  }

  let accountId;

  try {
    accountId = addressToAddress(value);
  } catch (error) {
    console.error('Unable to transform address', value);
  }

  return !accountId
    ? null
    : accountId;
};

const createOption = (address: string) => {
  let name: string | undefined;

  try {
    name = keyring.getAccount(address).getMeta().name;
  } catch (error) {
    try {
      name = keyring.getAddress(address).getMeta().name;
    } catch (error) {
      // ok, we don't have account or address
    }
  }

  return createItem(address, name);
};

class InputAddress extends React.PureComponent<Props, State> {
  state: State = {};

  static getDerivedStateFromProps ({ value }: Props): State | null {
    try {
      return {
        value: addressToAddress(value) || undefined
      } as State;
    } catch (error) {
      return null;
    }
  }

  static readOptions () {
    return store.get(STORAGE_KEY) || { defaults: {} };
  }

  static getLastValue (type: KeyringOption$Type = DEFAULT_TYPE) {
    const options = InputAddress.readOptions();

    return options.defaults[type];
  }

  static setLastValue (type: KeyringOption$Type = DEFAULT_TYPE, value: string) {
    const options = InputAddress.readOptions();

    options.defaults[type] = value;
    store.set(STORAGE_KEY, options);
  }

  render () {
    const { className, defaultValue, hideAddress = false, isDisabled = false, isError, label, optionsAll, type = DEFAULT_TYPE, style, withLabel } = this.props;
    const { value } = this.state;
    const hasOptions = optionsAll && Object.keys(optionsAll[type]).length !== 0;

    if (!hasOptions && !isDisabled) {
      return null;
    }

    const lastValue = InputAddress.getLastValue(type);
    const lastOption = this.getLastOptionValue();
    const actualValue = isDisabled || (defaultValue && this.hasValue(defaultValue))
      ? defaultValue
      : (
        this.hasValue(lastValue)
          ? lastValue
          : (lastOption && lastOption.value)
      );

    return (
      <Dropdown
        className={classes('ui--InputAddress', hideAddress ? 'flag--hideAddress' : '', className)}
        defaultValue={
          value !== undefined
            ? undefined
            : actualValue
        }
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        onChange={this.onChange}
        onSearch={this.onSearch}
        options={
          isDisabled && actualValue
            ? [createOption(actualValue)]
            : (optionsAll ? optionsAll[type] : [])
        }
        style={style}
        value={value}
        withLabel={withLabel}
      />
    );
  }

  private getLastOptionValue (): KeyringSectionOption | undefined {
    const { optionsAll, type = DEFAULT_TYPE } = this.props;

    if (!optionsAll) {
      return;
    }

    const available = optionsAll[type].filter(({ value }) =>
      !!value
    );

    return available.length
      ? available[available.length - 1]
      : undefined;
  }

  private hasValue (test?: string): boolean {
    const { optionsAll, type = DEFAULT_TYPE } = this.props;

    if (!optionsAll) {
      return false;
    }

    return !!optionsAll[type].find(({ value }) =>
      test === value
    );
  }

  private onChange = (address: string) => {
    const { onChange, type } = this.props;

    InputAddress.setLastValue(type, address);

    onChange && onChange(transformToAccountId(address));
  }

  private onSearch = (filteredOptions: KeyringSectionOptions, _query: string): KeyringSectionOptions => {
    const { isInput = true } = this.props;
    const query = _query.trim();
    const queryLower = query.toLowerCase();
    const matches = filteredOptions.filter((item) =>
      item.value !== null && (
        item.name.toLowerCase().indexOf(queryLower) !== -1 ||
        item.value.toLowerCase().indexOf(queryLower) !== -1
      )
    );

    const valueMatches = matches.filter((item) =>
      item.value !== null
    );

    if (isInput && valueMatches.length === 0) {
      const accountId = transformToAccountId(query);

      if (accountId) {
        matches.push(
          keyring.saveRecent(
            accountId
          ).option
        );
      }
    }

    return matches.filter((item, index) => {
      const isLast = index === matches.length - 1;
      const nextItem = matches[index + 1];
      const hasNext = nextItem && nextItem.value;

      return item.value !== null || (!isLast && hasNext);
    });
  }
}

export { InputAddress };

export default withMulti(
  InputAddress,
  withObservable(keyringOption.optionsSubject, { propName: 'optionsAll' })
);
