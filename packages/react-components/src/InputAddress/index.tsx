// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringOptions, KeyringSectionOption, KeyringSectionOptions, KeyringOption$Type } from '@polkadot/ui-keyring/options/types';
import { BareProps } from '../types';
import { Option } from './types';

import React from 'react';
import store from 'store';
import styled from 'styled-components';
import keyring from '@polkadot/ui-keyring';
import keyringOption from '@polkadot/ui-keyring/options';
import createKeyringItem from '@polkadot/ui-keyring/options/item';
import { withMulti, withObservable } from '@polkadot/react-api';

import { classes, getAddressName } from '../util';
import addressToAddress from '../util/toAddress';
import Dropdown from '../Dropdown';
import createHeader from './createHeader';
import createItem from './createItem';

interface Props extends BareProps {
  defaultValue?: string | null;
  help?: React.ReactNode;
  hideAddress?: boolean;
  isDisabled?: boolean;
  isError?: boolean;
  isInput?: boolean;
  isMultiple?: boolean;
  label?: string;
  labelExtra?: React.ReactNode;
  onChange?: (value: string | null) => void;
  onChangeMulti?: (value: string[]) => void;
  options?: Option[];
  optionsAll?: Record<string, Option[]>;
  placeholder?: string;
  type?: KeyringOption$Type;
  value?: string | Uint8Array | string[];
  withEllipsis?: boolean;
  withLabel?: boolean;
}

interface State {
  value?: string;
}

const STORAGE_KEY = 'options:InputAddress';
const DEFAULT_TYPE = 'all';

function transformToAddress (value: string | Uint8Array): string | null {
  try {
    return addressToAddress(value) || null;
  } catch (error) {
    console.error('Unable to transform address', value);
  }

  return null;
}

function transformToAccountId (value: string): string | null {
  if (!value) {
    return null;
  }

  const accountId = transformToAddress(value);

  return !accountId
    ? null
    : accountId;
}

function createOption (address: string): KeyringSectionOption {
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

  return createItem(createKeyringItem(address, name), !isRecent);
}

class InputAddress extends React.PureComponent<Props, State> {
  public state: State = {};

  public static getDerivedStateFromProps ({ value }: Props): Pick<State, never> | null {
    try {
      return {
        value: Array.isArray(value)
          ? value.map(addressToAddress)
          : (addressToAddress(value) || undefined)

      };
    } catch (error) {
      return null;
    }
  }

  public static readOptions (): Record<string, any> {
    return store.get(STORAGE_KEY) || { defaults: {} };
  }

  public static getLastValue (type: KeyringOption$Type = DEFAULT_TYPE): any {
    const options = InputAddress.readOptions();

    return options.defaults[type];
  }

  public static setLastValue (type: KeyringOption$Type = DEFAULT_TYPE, value: string): void {
    const options = InputAddress.readOptions();

    options.defaults[type] = value;
    store.set(STORAGE_KEY, options);
  }

  public render (): React.ReactNode {
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
    const actualOptions = options || (
      isDisabled && actualValue
        ? [createOption(actualValue)]
        : optionsAll
          ? optionsAll[type]
          : []
    );
    const _defaultValue = (isMultiple || value !== undefined)
      ? undefined
      : actualValue;

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

    const available = optionsAll[type].filter(({ value }): boolean => !!value);

    return available.length
      ? available[available.length - 1]
      : undefined;
  }

  private hasValue (test?: string): boolean {
    const { optionsAll, type = DEFAULT_TYPE } = this.props;

    if (!optionsAll) {
      return false;
    }

    return !!optionsAll[type].find(({ value }): boolean => test === value);
  }

  private onChange = (address: string): void => {
    const { onChange, type } = this.props;

    InputAddress.setLastValue(type, address);

    onChange && onChange(transformToAccountId(address));
  }

  private onChangeMulti = (addresses: string[]): void => {
    const { onChangeMulti } = this.props;

    if (onChangeMulti) {
      onChangeMulti(
        addresses
          .map(transformToAccountId)
          .filter((address): string => address as string) as string[]
      );
    }
  }

  private onSearch = (filteredOptions: KeyringSectionOptions, _query: string): KeyringSectionOptions => {
    const { isInput = true } = this.props;
    const query = _query.trim();
    const queryLower = query.toLowerCase();
    const matches = filteredOptions.filter((item): boolean =>
      item.value !== null && (
        item.name.toLowerCase().includes(queryLower) ||
        item.value.toLowerCase().includes(queryLower)
      )
    );

    const valueMatches = matches.filter((item): boolean =>
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

    return matches.filter((item, index): boolean => {
      const isLast = index === matches.length - 1;
      const nextItem = matches[index + 1];
      const hasNext = nextItem && nextItem.value;

      return item.value !== null || (!isLast && !!hasNext);
    });
  }
}

export { InputAddress };

const InputAddressExported = withMulti(
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
  withObservable(keyringOption.optionsSubject, {
    propName: 'optionsAll',
    transform: (optionsAll: KeyringOptions): Record<string, Option[]> =>
      Object.entries(optionsAll).reduce((result: Record<string, Option[]>, [type, options]): Record<string, Option[]> => {
        result[type] = options.map((option): Option =>
          option.value === null
            ? createHeader(option)
            : createItem(option)
        );

        return result;
      }, {})
  })
);

(InputAddressExported as any).createOption = createItem;

export default InputAddressExported;
