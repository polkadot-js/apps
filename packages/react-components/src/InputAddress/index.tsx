// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DropdownItemProps } from 'semantic-ui-react';
import type { KeyringOption$Type, KeyringOptions, KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import type { Option } from './types.js';

import React from 'react';
import store from 'store';

import { withMulti, withObservable } from '@polkadot/react-api/hoc';
import { keyring } from '@polkadot/ui-keyring';
import { createOptionItem } from '@polkadot/ui-keyring/options/item';
import { isNull, isUndefined } from '@polkadot/util';
import { isAddress } from '@polkadot/util-crypto';

import Dropdown from '../Dropdown.js';
import Static from '../Static.js';
import { styled } from '../styled.js';
import { getAddressName, toAddress } from '../util/index.js';
import createHeader from './createHeader.js';
import createItem from './createItem.js';

interface Props {
  className?: string;
  defaultValue?: Uint8Array | string | null;
  filter?: string[] | null;
  hideAddress?: boolean;
  isDisabled?: boolean;
  isError?: boolean;
  isInput?: boolean;
  isMultiple?: boolean;
  label?: React.ReactNode;
  labelExtra?: React.ReactNode;
  onChange?: (value: string | null) => void;
  onChangeMulti?: (value: string[]) => void;
  options?: KeyringSectionOption[] | null;
  optionsAll?: Record<string, Option[]>;
  placeholder?: string;
  type?: KeyringOption$Type;
  value?: string | Uint8Array | string[] | null;
  withEllipsis?: boolean;
  withExclude?: boolean;
  withLabel?: boolean;
}

type ExportedType = React.ComponentType<Props> & {
  createOption: (option: KeyringSectionOption, isUppercase?: boolean) => Option | null;
  setLastValue: (type: KeyringOption$Type, value: string) => void;
};

interface State {
  lastValue?: string;
  value?: string | string[];
}

const STORAGE_KEY = 'options:InputAddress';
const DEFAULT_TYPE = 'all';
const MULTI_DEFAULT: string[] = [];

function transformToAddress (value?: string | Uint8Array | null): string | null {
  try {
    return toAddress(value, false, keyring.keyring.type === 'ethereum' ? 20 : 32) || null;
  } catch {
    // noop, handled by return
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

function createOption (address: string): Option | null {
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

  return createItem(createOptionItem(address, name), !isRecent);
}

function readOptions (): Record<string, Record<string, string>> {
  return store.get(STORAGE_KEY) as Record<string, Record<string, string>> || { defaults: {} };
}

function getLastValue (type: KeyringOption$Type = DEFAULT_TYPE): string {
  const options = readOptions();

  return options.defaults[type];
}

function setLastValue (type: KeyringOption$Type = DEFAULT_TYPE, value: string): void {
  const options = readOptions();

  options.defaults[type] = value;
  store.set(STORAGE_KEY, options);
}

function dedupe (options: Option[]): Option[] {
  return options.reduce<Option[]>((all, o, index) => {
    const hasDupe = all.some(({ key }, eindex) =>
      eindex !== index &&
      key === o.key
    );

    if (!hasDupe) {
      all.push(o);
    }

    return all;
  }, []);
}

class InputAddress extends React.PureComponent<Props, State> {
  public override state: State = {};

  public static getDerivedStateFromProps ({ type, value }: Props, { lastValue }: State): Pick<State, never> | null {
    try {
      return {
        lastValue: lastValue || getLastValue(type),
        value: Array.isArray(value)
          ? value.map((v) => toAddress(v))
          : (toAddress(value) || undefined)
      };
    } catch {
      return null;
    }
  }

  public override render (): React.ReactNode {
    const { className = '', defaultValue, hideAddress = false, isDisabled = false, isError, isMultiple, label, labelExtra, options, optionsAll, placeholder, type = DEFAULT_TYPE, withEllipsis, withLabel } = this.props;
    const hasOptions = (options && options.length !== 0) || (optionsAll && Object.keys(optionsAll[type]).length !== 0);

    // the options could be delayed, don't render without
    if (!hasOptions && !isDisabled && !['allPlus'].includes(type)) {
      // This is nasty, but since this things is non-functional, there is not much
      // we can do (well, wrap it, however that approach is deprecated here)
      return (
        <Static
          className={className}
          label={label}
        >
          No accounts are available for selection.
        </Static>
      );
    }

    const { lastValue, value } = this.state;
    const lastOption = this.getLastOptionValue();
    const actualValue = transformToAddress(
      isDisabled || (defaultValue && defaultValue !== '0x' && (this.hasValue(defaultValue) || type === 'allPlus'))
        ? defaultValue
        : this.hasValue(lastValue)
          ? lastValue
          : lastOption?.value
    );
    const actualOptions: Option[] = options
      ? dedupe(
        options
          .map((o) => createItem(o))
          .filter((o): o is Option => !!o)
      )
      : isDisabled && actualValue
        ? [createOption(actualValue)].filter((o): o is Option => !!o)
        : actualValue
          ? this.addActual(actualValue)
          : this.getFiltered();
    const _defaultValue = (isMultiple || !isUndefined(value))
      ? undefined
      : actualValue;

    return (
      <StyledDropdown
        className={`${className} ui--InputAddress ${hideAddress ? 'hideAddress' : ''}`}
        defaultValue={_defaultValue}
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
        options={
          // FIXME: this is a "bit" of a HACK - the issue is that the "null"
          // value from Option is not correct for the supplied type. (This
          // originates in the ui repo for the KeyringOption)
          actualOptions as unknown as React.ReactNode[]
        }
        placeholder={placeholder}
        renderLabel={
          isMultiple
            ? this.renderLabel
            : undefined
        }
        value={
          isMultiple && !value
            ? MULTI_DEFAULT
            : value
        }
        withEllipsis={withEllipsis}
        withLabel={withLabel}
      />
    );
  }

  private addActual (actualValue: string): Option[] {
    const base = this.getFiltered();

    return this.hasValue(actualValue)
      ? base
      : base.concat(...[createOption(actualValue)].filter((o): o is Option => !!o));
  }

  private renderLabel = ({ value }: KeyringSectionOption): React.ReactNode => {
    if (!value) {
      return undefined;
    }

    return getAddressName(value);
  };

  private getLastOptionValue (): KeyringSectionOption | undefined {
    const available = this.getFiltered();

    return available.length
      ? available[available.length - 1]
      : undefined;
  }

  private hasValue (test?: Uint8Array | string | null): boolean {
    const address = test?.toString();

    return this.getFiltered().some(({ value }) => value === address);
  }

  private getFiltered (): Option[] {
    const { filter, optionsAll, type = DEFAULT_TYPE, withExclude = false } = this.props;

    return !optionsAll
      ? []
      : dedupe(optionsAll[type]).filter(({ value }) =>
        !filter || (
          !!value && (
            withExclude
              ? !filter.includes(value)
              : filter.includes(value)
          )
        )
      );
  }

  private onChange = (address: string): void => {
    const { filter, onChange, type } = this.props;

    !filter && setLastValue(type, address);

    onChange && onChange(
      !!address && (this.hasValue(address) || (type === 'allPlus' && isAddress(address)))
        ? transformToAccountId(address)
        : null
    );
  };

  private onChangeMulti = (addresses: string[]): void => {
    const { onChangeMulti } = this.props;

    if (onChangeMulti) {
      onChangeMulti(
        addresses
          .map(transformToAccountId)
          .filter((address): address is string => !!address)
      );
    }
  };

  private onSearch = (filteredOptions: DropdownItemProps[], _query: string): DropdownItemProps[] => {
    const { isInput = true } = this.props;
    const query = _query.trim();
    const queryLower = query.toLowerCase();
    const matches = filteredOptions.filter((item): boolean =>
      !!item.value && typeof item.name === 'string' && (
        (item.name.toLowerCase?.().includes(queryLower)) ||
        item.value.toString().toLowerCase().includes(queryLower)
      )
    );

    if (isInput && matches.length === 0) {
      const accountId = transformToAccountId(query);

      if (accountId) {
        const account = keyring.getAccount(accountId);

        if (account) {
          matches.push({
            key: account.address,
            name: account.meta.name,
            value: account.address
          });
        } else {
          const item = keyring.saveRecent(
            accountId.toString()
          ).option;

          matches.push({
            key: item.key,
            name: item.name,
            value: item.value || undefined
          });
        }
      }
    }

    // FIXME The return here is _very_ suspect, but it actually does exactly
    // what it is meant to do... filter and return the options for clicking
    //
    // (effectively it seems to be the value type that should allow undefined
    // instead of null in there...)
    return matches.filter((item, index): boolean => {
      const isLast = index === matches.length - 1;
      const nextItem = matches[index + 1];
      const hasNext = nextItem?.value;

      return !(isNull(item.value) || isUndefined(item.value)) || (!isLast && !!hasNext);
    });
  };
}

const StyledDropdown = styled(Dropdown)`
  .ui.dropdown .text {
    width: 100%;
  }

  .ui.disabled.search {
    pointer-events: all;
  }

  .ui.search.selection.dropdown {
    > .text > .ui--KeyPair {
      .ui--IdentityIcon {
        left: -2.75rem;
        top: -1.05rem;

        > div,
        img,
        svg {
          height: 32px !important;
          width: 32px !important;
        }
      }

      .name {
        margin-left: 0;

        > .ui--AccountName {
          height: auto;
        }
      }
    }

    > .menu > div.item > .ui--KeyPair > .name  > .ui--AccountName {
      height: auto;
    }
  }

  &.hideAddress .ui.search.selection.dropdown > .text > .ui--KeyPair .address {
    flex: 0;
    max-width: 0;
  }
`;

const ExportedComponent = withMulti(
  InputAddress,
  withObservable(keyring.keyringOption.optionsSubject, {
    propName: 'optionsAll',
    transform: (optionsAll: KeyringOptions): Record<string, (Option | React.ReactNode)[]> =>
      Object.entries(optionsAll).reduce((result: Record<string, (Option | React.ReactNode)[]>, [type, options]): Record<string, (Option | React.ReactNode)[]> => {
        result[type] = options
          .map((option): Option | React.ReactNode | null =>
            option.value === null
              ? createHeader(option)
              : createItem(option)
          )
          .filter((o): o is Option | React.ReactNode => !!o);

        return result;
      }, {})
  })
) as ExportedType;

ExportedComponent.createOption = createItem;
ExportedComponent.setLastValue = setLastValue;

export default ExportedComponent;
