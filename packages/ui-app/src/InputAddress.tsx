// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';
import { KeyringOptions, KeyringSectionOption, KeyringSectionOptions, KeyringOption$Type } from '@polkadot/ui-keyring/options/types';

import React from 'react';
import store from 'store';
import styled from 'styled-components';
import createItem from '@polkadot/ui-keyring/options/item';
import keyring from '@polkadot/ui-keyring';
import keyringOption from '@polkadot/ui-keyring/options';
import { withMulti, withObservable } from '@polkadot/ui-api';

import { classes, getAddressName } from './util';
import addressToAddress from './util/toAddress';
import Dropdown from './Dropdown';

type Props = BareProps & {
  defaultValue?: string | null,
  help?: React.ReactNode,
  hideAddress?: boolean;
  isDisabled?: boolean,
  isError?: boolean,
  isInput?: boolean,
  isMultiple?: boolean,
  label?: string,
  labelExtra?: React.ReactNode,
  onChange?: (value: string | null) => void,
  onChangeMulti?: (value: Array<string>) => void,
  options?: Array<KeyringSectionOption>,
  optionsAll?: KeyringOptions,
  placeholder?: string,
  type?: KeyringOption$Type,
  value?: string | Uint8Array | Array<string>,
  withEllipsis?: boolean,
  withLabel?: boolean
};

type State = {
  value?: string
};

const STORAGE_KEY = 'options:InputAddress';
const DEFAULT_TYPE = 'all';

const transformToAddress = (value: string | Uint8Array): string | null => {
  try {
    return addressToAddress(value) || null;
  } catch (error) {
    console.error('Unable to transform address', value);
  }

  return null;
};

const transformToAccountId = (value: string): string | null => {
  if (!value) {
    return null;
  }

  const accountId = transformToAddress(value);

  return !accountId
    ? null
    : accountId;
};

const createOption = (address: string) => {
  let isRecent: boolean | undefined;
  const pair = keyring.getAccount(address);
  let name: string | undefined;

  if (pair) {
    name = pair.meta.name;
  } else {
    const addr = keyring.getAddress(address);

    if (addr) {
      name = addr.meta.name;
      isRecent = addr.meta.isRecent;
    } else {
      isRecent = true;
    }
  }

  return createItem(address, name, !isRecent);
};

class InputAddress extends React.PureComponent<Props, State> {
  state: State = {};

  static getDerivedStateFromProps ({ value }: Props): State | null {
    try {
      return {
        value: Array.isArray(value)
          ? value.map(addressToAddress)
          : (addressToAddress(value) || undefined)

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
    const { className, defaultValue, help, hideAddress = false, isDisabled = false, isError, isMultiple, label, labelExtra, options, optionsAll, placeholder, type = DEFAULT_TYPE, style, withEllipsis, withLabel } = this.props;
    const { value } = this.state;
    const hasOptions = (options && options.length !== 0) || (optionsAll && Object.keys(optionsAll[type]).length !== 0);

    if (!hasOptions && !isDisabled) {
      return null;
    }

    const lastValue = InputAddress.getLastValue(type);
    const lastOption = this.getLastOptionValue();
    const actualValue = transformToAddress(
        isDisabled || (defaultValue && this.hasValue(defaultValue))
        ? defaultValue
        : (
          this.hasValue(lastValue)
            ? lastValue
            : (lastOption && lastOption.value)
        )
    );
    const actualOptions = options
      ? options
      : (
          isDisabled && actualValue
            ? [createOption(actualValue)]
            : (optionsAll ? optionsAll[type] : [])
      );
    let _defaultValue;

    if (value !== undefined) {
      _defaultValue = undefined;
    } else if (isMultiple) {
      _defaultValue = undefined;
    } else {
      _defaultValue = actualValue;
    }

    return (
      <Dropdown
        className={classes('ui--InputAddress', hideAddress && 'hideAddress', className)}
        defaultValue={_defaultValue}
        help={help}
        isDisabled={isDisabled}
        isError={isError}
        isMultiple={isMultiple}
        label={label}
        labelExtra={labelExtra}
        onChange={
          isMultiple
            ? this.onChangeMulti
            : this.onChange
        }
        onSearch={this.onSearch}
        options={actualOptions}
        placeholder={placeholder}
        renderLabel={
          isMultiple
            ? this.renderLabel
            : undefined
        }
        style={style}
        value={
          isMultiple
            ? undefined
            : value
        }
        withEllipsis={withEllipsis}
        withLabel={withLabel}
      />
    );
  }

  private renderLabel = ({ value }: KeyringSectionOption): string | undefined => {
    if (!value) {
      return undefined;
    }

    return getAddressName(value, null, true);
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

  private onChangeMulti = (addresses: Array<string>) => {
    const { onChangeMulti } = this.props;

    if (onChangeMulti) {
      onChangeMulti(
        addresses
          .map(transformToAccountId)
          .filter((address) => address) as Array<string>
      );
    }
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
            accountId.toString()
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
  styled(InputAddress)`
    .ui.dropdown .text {
      width: 100%;
    }

    .ui.search.selection.dropdown {
      > .text > .ui--KeyPair {
        .ui--IdentityIcon {
          border: 1px solid #888;
          border-radius: 50%;
          left: -2.75rem;
          top: -1.2rem;
        }

        .name {
          margin-left: 0;
        }
      }
    }

    &.hideAddress .ui--KeyPair .address {
      flex: 0;
      max-width: 0;
    }
  `,
  withObservable(keyringOption.optionsSubject, { propName: 'optionsAll' })
);
