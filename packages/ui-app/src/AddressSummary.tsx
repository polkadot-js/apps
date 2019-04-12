// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from './types';

import BN from 'bn.js';
import React from 'react';
import { AccountId, AccountIndex, Address } from '@polkadot/types';
import { Nonce } from '@polkadot/ui-reactive';
import { withCalls } from '@polkadot/ui-api';
import BaseIdentityIcon from '@polkadot/ui-identicon';

import { classes, toShortAddress } from './util';
import BalanceDisplay from './Balance';
import BondedDisplay from './Bonded';
import IdentityIcon from './IdentityIcon';
import translate from './translate';

export type Props = I18nProps & {
  accounts_idAndIndex?: [AccountId?, AccountIndex?],
  balance?: BN | Array<BN>,
  bonded?: BN | Array<BN>,
  children?: React.ReactNode,
  extraInfo?: React.ReactNode,
  name?: string,
  value: AccountId | AccountIndex | Address | string | null,
  withBalance?: boolean,
  withBonded?: boolean,
  withIndex?: boolean,
  identIconSize?: number,
  isShort?: boolean,
  session_validators?: Array<AccountId>,
  withCopy?: boolean,
  withIcon?: boolean,
  withNonce?: boolean
};

const DEFAULT_ADDR = '5'.padEnd(16, 'x');

class AddressSummary extends React.PureComponent<Props> {
  render () {
    const { accounts_idAndIndex = [], className, style } = this.props;
    const [accountId, accountIndex] = accounts_idAndIndex;
    const isValid = accountId || accountIndex;

    return (
      <div
        className={classes('ui--AddressSummary', !isValid && 'invalid', className)}
        style={style}
      >
        <div className='ui--AddressSummary-base'>
          {this.renderIcon()}
          {this.renderAccountId()}
          {this.renderAccountIndex()}
          {this.renderBalance()}
          {this.renderBonded()}
          {this.renderNonce()}
        </div>
        {this.renderChildren()}
      </div>
    );
  }

  protected renderAddress () {
    const { name, isShort = true, value } = this.props;

    if (!value) {
      return null;
    }

    const address = value.toString();

    return (
      <div className='ui--AddressSummary-data'>
        <div className='ui--AddressSummary-name'>
          {name}
        </div>
        <div className='ui--AddressSummary-accountId'>
          {
            isShort
              ? toShortAddress(address)
              : value
          }
        </div>
      </div>
    );
  }

  protected renderAccountId () {
    const { accounts_idAndIndex = [], name, isShort = true, value } = this.props;
    const [_accountId, accountIndex] = accounts_idAndIndex;
    const accountId = _accountId || value;

    if (!accountId && accountIndex) {
      return null;
    }

    const address = accountId
      ? accountId.toString()
      : DEFAULT_ADDR;

    return (
      <div className='ui--AddressSummary-data'>
        <div className='ui--AddressSummary-name'>
          {name}
        </div>
        <div className='ui--AddressSummary-accountId'>
          {
            isShort
              ? toShortAddress(address)
              : address
          }
        </div>
      </div>
    );
  }

  protected renderAccountIndex () {
    const { accounts_idAndIndex = [], withIndex = true } = this.props;
    const [, accountIndex] = accounts_idAndIndex;

    if (!accountIndex || !withIndex) {
      return null;
    }

    const address = accountIndex.toString();

    return (
      <div className='ui--AddressSummary-data'>
        <div className='ui--AddressSummary-name'></div>
        <div className='ui--AddressSummary-accountIndex'>
          {address}
        </div>
      </div>
    );
  }

  protected renderBalance () {
    const { accounts_idAndIndex = [], balance, t, value, withBalance = true } = this.props;
    const [_accountId] = accounts_idAndIndex;
    const accountId = _accountId || value;

    if (!withBalance || !accountId) {
      return null;
    }

    return (
      <BalanceDisplay
        balance={balance}
        className='ui--AddressSummary-balance'
        label={t('balance ')}
        params={accountId}
      />
    );
  }

  protected renderBonded () {
    const { accounts_idAndIndex = [], bonded, t, value, withBonded } = this.props;
    const [_accountId] = accounts_idAndIndex;
    const accountId = _accountId || value;

    if (!withBonded || !accountId) {
      return null;
    }

    return (
      <BondedDisplay
        bonded={bonded}
        className='ui--AddressSummary-bonded'
        label={t('bonded ')}
        params={accountId}
      />
    );
  }

  protected renderIcon (className: string = 'ui--AddressSummary-icon', size?: number) {
    const { accounts_idAndIndex = [], identIconSize = 96, value, withIcon = true } = this.props;

    if (!withIcon) {
      return null;
    }

    const [_accountId] = accounts_idAndIndex;
    const accountId = (_accountId || value || '').toString();

    // Since we do queries to storage in the wrapped example, we don't want
    // to follow that route if we don't have a valid address.
    const Component = accountId
      ? IdentityIcon
      : BaseIdentityIcon;

    return (
      <Component
        className={className}
        size={size || identIconSize}
        value={accountId}
      />
    );
  }

  protected renderNonce () {
    const { accounts_idAndIndex = [], t, value, withNonce = true } = this.props;
    const [_accountId] = accounts_idAndIndex;
    const accountId = _accountId || value;

    if (!withNonce || !accountId) {
      return null;
    }

    return (
      <Nonce
        className='ui--AddressSummary-nonce'
        params={accountId.toString()}
      >
        {t(' transactions')}
      </Nonce>
    );
  }

  protected renderChildren () {
    const { children } = this.props;

    if (!children || (Array.isArray(children) && children.length === 0)) {
      return null;
    }

    return (
      <div className='ui--AddressSummary-children'>
        {children}
      </div>
    );
  }
}

export {
  DEFAULT_ADDR,
  AddressSummary
};

export default translate(
  withCalls<Props>(
    ['derive.accounts.idAndIndex', { paramName: 'value' }]
  )(AddressSummary)
);
