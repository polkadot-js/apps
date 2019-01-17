// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from './types';

import React from 'react';
import { AccountId, AccountIndex, Address, Balance } from '@polkadot/types';
import { Nonce } from '@polkadot/ui-reactive/index';
import { withCall, withMulti } from '@polkadot/ui-api/index';

import classes from './util/classes';
import toShortAddress from './util/toShortAddress';
import BalanceDisplay from './Balance';
import IdentityIcon from './IdentityIcon';
import translate from './translate';

export type Props = I18nProps & {
  derive_accounts_idAndIndex?: [AccountId?, AccountIndex?],
  balance?: Balance | Array<Balance>,
  children?: React.ReactNode,
  name?: string,
  value: AccountId | AccountIndex | Address | string | null,
  withBalance?: boolean,
  withIndex?: boolean,
  identIconSize?: number,
  isShort?: boolean,
  query_session_validators?: Array<AccountId>,
  withCopy?: boolean,
  withIcon?: boolean,
  withNonce?: boolean
};

const DEFAULT_ADDR = '5'.padEnd(16, 'x');

class AddressSummary extends React.PureComponent<Props> {
  render () {
    const { derive_accounts_idAndIndex = [], className, style } = this.props;
    const [accountId, accountIndex] = derive_accounts_idAndIndex;
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
    const { derive_accounts_idAndIndex = [], name, isShort = true } = this.props;
    const [accountId, accountIndex] = derive_accounts_idAndIndex;

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
    const { derive_accounts_idAndIndex = [] } = this.props;
    const [, accountIndex] = derive_accounts_idAndIndex;

    if (!accountIndex) {
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
    const { balance, t, withBalance = true, value } = this.props;

    if (!withBalance) {
      return null;
    }

    return (
      <BalanceDisplay
        balance={balance}
        className='ui--AddressSummary-balance'
        label={t('addressSummary.balance', {
          defaultValue: 'balance '
        })}
        value={value}
      />
    );
  }

  protected renderIcon (className: string = 'ui--AddressSummary-icon', size?: number) {
    const { derive_accounts_idAndIndex = [], identIconSize = 96, query_session_validators, value, withIcon = true } = this.props;

    if (!withIcon) {
      return null;
    }

    const [_accountId] = derive_accounts_idAndIndex;
    const accountId = (_accountId || '').toString();
    const isValidator = (query_session_validators || []).find((validator) =>
      validator.toString() === accountId
    );

    return (
      <IdentityIcon
        className={className}
        isHighlight={!!isValidator}
        size={size || identIconSize}
        value={value ? value.toString() : DEFAULT_ADDR}
      />
    );
  }

  protected renderNonce () {
    const { derive_accounts_idAndIndex = [], t, withNonce = true } = this.props;
    const [accountId] = derive_accounts_idAndIndex;

    if (!withNonce || !accountId) {
      return null;
    }

    return (
      <Nonce
        className='ui--AddressSummary-nonce'
        params={accountId.toString()}
      >
        {t('addressSummary.transactions', {
          defaultValue: ' transactions'
        })}
      </Nonce>
    );
  }

  protected renderChildren () {
    const { children } = this.props;

    if (!children) {
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

export default withMulti(
  AddressSummary,
  translate,
  withCall('derive.accounts.idAndIndex', { paramProp: 'value' }),
  withCall('query.session.validators')
);
