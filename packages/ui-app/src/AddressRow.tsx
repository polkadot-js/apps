/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { AccountId, AccountIndex, Address } from '@polkadot/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { withCalls, withMulti } from '@polkadot/ui-api';
import BaseIdentityIcon from '@polkadot/ui-identicon';
import keyring from '@polkadot/ui-keyring';

import AddressInfo, { BalanceActiveType } from './AddressInfo';
import { classes, getAddressName, getAddressTags, toShortAddress } from './util';
import CopyButton from './CopyButton';
import IdentityIcon from './IdentityIcon';
import Row, { RowProps, RowState, styles } from './Row';
import translate from './translate';

export type Props = I18nProps & RowProps & {
  bonded?: BN | BN[];
  isContract?: boolean;
  isValid?: boolean;
  label?: string;
  value: AccountId | AccountIndex | Address | string | null;
  withAddressOrName?: boolean;
  withBalance?: boolean | BalanceActiveType;
  withIndex?: boolean;
};

type State = RowState;

const DEFAULT_ADDR = '5'.padEnd(16, 'x');
const ICON_SIZE = 48;

class AddressRow extends Row<Props, State> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    this.state = this.createState();
  }

  public static getDerivedStateFromProps ({ accounts_idAndIndex = [], defaultName, type, value }: Props, prevState: State): State | null {
    const [_accountId] = accounts_idAndIndex;
    const accountId = _accountId || value;
    const address = accountId
      ? accountId.toString()
      : DEFAULT_ADDR;
    const name = getAddressName(address, type, false, defaultName || '<unknown>') || '';
    const tags = getAddressTags(address, type);
    const state: Partial<State> = { tags };
    let hasChanged = false;

    if (address !== prevState.address) {
      state.address = address;
      hasChanged = true;
    }

    if (!prevState.isEditingName && name !== prevState.name) {
      state.name = name;
      hasChanged = true;
    }

    return hasChanged
      ? state as State
      : null;
  }

  public render (): React.ReactNode {
    const { accounts_idAndIndex = [], className, isContract, isInline, style } = this.props;
    const [accountId, accountIndex] = accounts_idAndIndex;
    const isValid = this.props.isValid || accountId || accountIndex;

    return (
      <div
        className={classes('ui--Row', !isValid && 'invalid', isInline && 'inline', className)}
        style={style}
      >
        <div className='ui--Row-base'>
          {this.renderIcon()}
          <div className='ui--Row-details'>
            {this.renderLabel()}
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
    const { accounts_idAndIndex = [], defaultName, type, value } = this.props;
    const [_accountId] = accounts_idAndIndex;
    const accountId = _accountId || value;
    const address = accountId
      ? accountId.toString()
      : DEFAULT_ADDR;
    const name = getAddressName(address, type, false, defaultName || '<unknown>') || '';
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
    const { address } = this.state;

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
    const { accounts_idAndIndex = [], withIndex } = this.props;
    const [, accountIndex] = accounts_idAndIndex;

    if (!accountIndex || !withIndex) {
      return null;
    }

    return (
      <div className='ui--Row-accountIndex'>
        {accountIndex.toString()}
      </div>
    );
  }

  private renderBalances (): React.ReactNode {
    const { accounts_idAndIndex = [], withBalance } = this.props;
    const [accountId] = accounts_idAndIndex;

    if (!withBalance || !accountId) {
      return null;
    }

    return (
      <div className='ui--Row-balances'>
        <AddressInfo
          address={accountId}
          withBalance={withBalance}
        />
      </div>
    );
  }

  private renderIcon (): React.ReactNode {
    const { accounts_idAndIndex = [], iconInfo, withIcon = true } = this.props;
    const { address } = this.state;
    const [accountId] = accounts_idAndIndex;

    if (!withIcon) {
      return null;
    }

    // Since we do queries to storage in the wrapped example, we don't want
    // to follow that route if we don't have a valid address.
    const Component = accountId
      ? IdentityIcon
      : BaseIdentityIcon;

    return (
      <div className='ui--Row-icon'>
        <Component
          size={ICON_SIZE}
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

  private renderLabel (): React.ReactNode {
    const { label } = this.props;

    if (!label) {
      return null;
    }

    return (
      <label className='account-label'>{label}</label>
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

      this.setState({ isEditingName: false });
    }
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
  styled(AddressRow as React.ComponentClass<Props>)`
    ${styles}
  `,
  translate,
  withCalls<Props>(
    ['derive.accounts.idAndIndex', { paramName: 'value' }]
  )
);
