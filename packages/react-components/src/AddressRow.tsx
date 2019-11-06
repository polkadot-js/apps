/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountInfo, DerivedStaking } from '@polkadot/api-derive/types';
import { ApiProps } from '@polkadot/react-api/types';
import { I18nProps } from '@polkadot/react-components/types';
import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { withCalls, withMulti } from '@polkadot/react-api';
import BaseIdentityIcon from '@polkadot/react-identicon';
import keyring from '@polkadot/ui-keyring';

import AddressInfo, { BalanceActiveType, ValidatorPrefsType } from './AddressInfo';
import { classes, getAddressName, getAddressTags, toShortAddress } from './util';
import CopyButton from './CopyButton';
import IdentityIcon, { getIdentityTheme } from './IdentityIcon';
import Row, { RowProps, RowState as State, styles } from './Row';
import translate from './translate';

export interface Props extends I18nProps, RowProps {
  bonded?: BN | BN[];
  extraInfo?: [React.ReactNode, React.ReactNode][];
  isContract?: boolean;
  isDisabled?: boolean;
  isValid?: boolean;
  label?: string;
  accounts_info?: DeriveAccountInfo;
  noDefaultNameOpacity?: boolean;
  stakingInfo?: DerivedStaking;
  value: AccountId | AccountIndex | Address | string | null;
  withAddressOrName?: boolean;
  withBalance?: boolean | BalanceActiveType;
  withIndex?: boolean;
  withIndexOrAddress?: boolean;
  withValidatorPrefs?: boolean | ValidatorPrefsType;
}

const DEFAULT_ADDR = '5'.padEnd(16, 'x');
const ICON_SIZE = 48;

class AddressRow extends Row<ApiProps & Props, State> {
  public state: State;

  constructor (props: ApiProps & Props) {
    super(props);

    this.state = this.createState();
  }

  public static getDerivedStateFromProps ({ accounts_info = {}, defaultName, isEditable, noDefaultNameOpacity, type, value }: Props, prevState: State): State | null {
    const accountId = accounts_info.accountId || value;
    const address = accountId
      ? accountId.toString()
      : DEFAULT_ADDR;
    const [, isDefault, nameInner] = accounts_info.nickname
      ? [true, false, accounts_info.nickname.toUpperCase()]
      : getAddressName(address, type, defaultName || '<unknown>');
    const name = isDefault && !noDefaultNameOpacity && !isEditable
      ? <div className='ui--Row-placeholder'>{nameInner}</div>
      : nameInner;
    const tags = getAddressTags(address, type);
    const state: Partial<State> = { tags };
    let hasChanged = false;

    if (address !== prevState.address) {
      state.address = address;
      hasChanged = true;
    }

    if (!prevState.isEditingName && name !== prevState.name) {
      state.name = name as string;
      hasChanged = true;
    }

    return hasChanged
      ? state as State
      : null;
  }

  public render (): React.ReactNode {
    const { accounts_info = {}, className, isContract, isDisabled, isInline, label, style } = this.props;
    const { accountId, accountIndex } = accounts_info;
    const isValid = this.props.isValid || accountId || accountIndex;

    return (
      <div
        className={classes('ui--Row', isDisabled && 'disabled', !isValid && 'invalid', isInline && 'inline', className)}
        style={style}
      >
        <div className='ui--Row-base'>
          {this.renderIcon()}
          <div className='ui--Row-details'>
            {label && <label className='account-label'>{label}</label>}
            {this.renderAddressAndName()}
            {this.renderAccountIndex()}
            {!isContract && this.renderBalances()}
            {this.renderTags()}
          </div>
          {this.renderButtons()}
        </div>
        {this.renderChildren()}
      </div>
    );
  }

  private createState (): State {
    const { accounts_info = {}, defaultName, type, value } = this.props;
    const accountId = accounts_info.accountId || value;
    const address = accountId
      ? accountId.toString()
      : DEFAULT_ADDR;
    const [, , name] = getAddressName(address, type, defaultName || '<unknown>');
    const tags = getAddressTags(address, type);

    return {
      ...this.state,
      address,
      name,
      tags
    };
  }

  protected renderAddressAndName (): React.ReactNode {
    const { withAddressOrName = false } = this.props;

    if (withAddressOrName) {
      return this.renderName(true);
    } else {
      return (
        <>
          {this.renderName()}
          {this.renderAddress()}
        </>
      );
    }
  }

  private renderAddress (): React.ReactNode {
    const { accounts_info = {}, withIndexOrAddress = true } = this.props;
    const { address } = this.state;
    const { accountIndex } = accounts_info;

    if (accountIndex && withIndexOrAddress) {
      return null;
    }

    return (
      <div className='ui--Row-accountId'>
        <CopyButton
          isAddress
          value={address}
        >
          <span>{toShortAddress(address)}</span>
        </CopyButton>
      </div>
    );
  }

  private renderAccountIndex (): React.ReactNode {
    const { accounts_info = {}, withIndex = true, withIndexOrAddress = true } = this.props;
    const { accountIndex } = accounts_info;

    if (!accountIndex || !(withIndex || withIndexOrAddress)) {
      return null;
    }

    return (
      <div className='ui--Row-accountIndex'>
        {accountIndex.toString()}
      </div>
    );
  }

  private renderBalances (): React.ReactNode {
    const { accounts_info = {}, extraInfo, stakingInfo, withBalance, withValidatorPrefs } = this.props;
    const { accountId } = accounts_info;

    if (!(withBalance || withValidatorPrefs) || !accountId) {
      return null;
    }

    return (
      <div className='ui--Row-balances'>
        <AddressInfo
          address={accountId}
          extraInfo={extraInfo}
          stakingInfo={stakingInfo}
          withBalance={withBalance}
          withValidatorPrefs={withValidatorPrefs}
        />
      </div>
    );
  }

  private renderIcon (): React.ReactNode {
    const { accounts_info = {}, iconInfo, systemName, withIcon = true } = this.props;
    const { address } = this.state;
    const { accountId } = accounts_info;

    if (!withIcon) {
      return null;
    }

    // Since we do queries to storage in the wrapped example, we don't want
    // to follow that route if we don't have a valid address.
    const Component = accountId
      ? IdentityIcon
      : BaseIdentityIcon;
    const theme = getIdentityTheme(systemName);

    return (
      <div className='ui--Row-icon'>
        <Component
          size={ICON_SIZE}
          theme={theme}
          value={address}
        />
        {iconInfo && (
          <div className='ui--Row-icon-info'>
            {iconInfo}
          </div>
        )}
      </div>
    );
  }

  protected saveName = (): void => {
    const { address, name } = this.state;
    const trimmedName = name.trim();
    const meta = {
      name: trimmedName,
      whenEdited: Date.now()
    };

    // Save only if the name was changed or if it's no empty.
    if (trimmedName && address) {
      try {
        const currentKeyring = keyring.getPair(address);

        currentKeyring && keyring.saveAccountMeta(currentKeyring, meta);
      } catch (error) {
        keyring.saveAddress(address, meta);
      }
    }

    this.setState({ isEditingName: false });
  }

  protected saveTags = (): void => {
    const { address, tags } = this.state;
    const meta = {
      tags,
      whenEdited: Date.now()
    };

    if (address) {
      try {
        const currentKeyring = keyring.getPair(address);

        currentKeyring && keyring.saveAccountMeta(currentKeyring, meta);
      } catch (error) {
        keyring.saveAddress(address, meta);
      }

      this.setState({ isEditingTags: false });
    }
  }
}

export {
  DEFAULT_ADDR,
  AddressRow
};

export default withMulti(
  styled(AddressRow as React.ComponentClass<Props & ApiProps, State>)`
    ${styles}

    .ui--Row-placeholder {
      opacity: 0.5;
    }
  `,
  translate,
  withCalls<Props>(
    ['derive.accounts.info', { paramName: 'value' }]
  )
);
