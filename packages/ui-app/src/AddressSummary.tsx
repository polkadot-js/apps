// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address } from '@polkadot/types';
import BaseIdentityIcon from '@polkadot/ui-identicon';
import BN from 'bn.js';
import { Input } from '@polkadot/ui-app';
import keyring from '@polkadot/ui-keyring';
import { Nonce } from '@polkadot/ui-reactive';
import React from 'react';
import { withCalls } from '@polkadot/ui-api';

import AvailableDisplay from './Available';
import BalanceDisplay from './Balance';
import BondedDisplay from './Bonded';
import { classes, getAddrName, toShortAddress } from './util';
import IdentityIcon from './IdentityIcon';
import { I18nProps } from './types';
import translate from './translate';
import UnlockingDisplay from './Unlocking';

export type Props = I18nProps & {
  accounts_idAndIndex?: [AccountId?, AccountIndex?],
  balance?: BN | Array<BN>,
  bonded?: BN | Array<BN>,
  children?: React.ReactNode,
  defaultName?: string,
  extraInfo?: React.ReactNode,
  identIconSize?: number,
  isEditable?: boolean,
  isInline?: boolean,
  isShort?: boolean,
  session_validators?: Array<AccountId>,
  value: AccountId | AccountIndex | Address | string | null,
  withAvailable?: boolean,
  withBalance?: boolean,
  withBonded?: boolean,
  withCopy?: boolean,
  withIcon?: boolean,
  withIndex?: boolean,
  withNonce?: boolean,
  withUnlocking?: boolean
};

type State = {
  isEditing: boolean
  name: string
};

const DEFAULT_ADDR = '5'.padEnd(16, 'x');

class AddressSummary extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const { accounts_idAndIndex = [], defaultName, value } = this.props;
    const [_accountId] = accounts_idAndIndex;
    const accountId = _accountId || value;

    const address = accountId
      ? accountId.toString()
      : DEFAULT_ADDR;

    this.state = {
      isEditing: false,
      name: getAddrName(address, false, defaultName) || ''
    };
  }

  render () {
    const { accounts_idAndIndex = [], className, isInline, style } = this.props;
    const [accountId, accountIndex] = accounts_idAndIndex;
    const isValid = accountId || accountIndex;

    return (
      <div
        className={classes('ui--AddressSummary', !isValid && 'invalid', isInline && 'inline', className)}
        style={style}
      >
        <div className='ui--AddressSummary-base'>
          {this.renderIcon()}
          <div className='ui--AddressSummary-data'>
            {this.renderName()}
            {this.renderAddress()}
          </div>
          {this.renderAvailable()}
          {this.renderBalance()}
          {this.renderBonded()}
          {this.renderNonce()}
          {this.renderUnlocking()}
        </div>
        {this.renderChildren()}
      </div>
    );
  }

  protected renderAddress () {
    const { isShort = true, value } = this.props;

    if (!value) {
      return null;
    }

    const address = value.toString();

    return (
        <div className='ui--AddressSummary-accountId'>
          {
            isShort
              ? toShortAddress(address)
              : value
          }
        </div>
    );
  }

  protected renderName () {
    const { isEditable } = this.props;
    const { isEditing, name } = this.state;

    let className = 'ui--AddressSummary-name';
    if (isEditable) className = className.concat(' editable');

    const resultingDom = isEditing ?
      <Input
        autoFocus
        className='full'
        onChange={this.onChangeName}
        onBlur={this.saveName}
        onKeyDown={this.handleKeyDown}
        value={name}
        withLabel={false}
      /> :
      <div
        className={className}
        onClick={ isEditable ? this.toggleEditor : undefined }
      >
        {name}
      </div>;

    return resultingDom;
  }

  protected handleKeyDown = (e: React.KeyboardEvent<Element>) => {
    const { key } = e;
    switch (key) {
      case 'Enter':
      case 'Escape':
        this.saveName();
        break;
    }
  }

  protected toggleEditor = () => {
    this.setState({ isEditing : !this.state.isEditing });
  }

  protected onChangeName = (newName: string) => {
    this.setState({ name : newName });
  }

  protected saveName = () => {
    const { value } = this.props;
    const { name } = this.state;
    const currentKeyring = value && keyring.getPair(value.toString());

    currentKeyring && keyring.saveAccountMeta(currentKeyring, { name: name, whenEdited: Date.now() });

    this.toggleEditor();
  }

  /*
  protected renderAccountId () {
    const { accounts_idAndIndex = [], isShort = true, value } = this.props;
    const [_accountId, accountIndex] = accounts_idAndIndex;
    const accountId = _accountId || value;

    if (!accountId && accountIndex) {
      return null;
    }

    const address = accountId
      ? accountId.toString()
      : DEFAULT_ADDR;

    return (

        <div className='ui--AddressSummary-accountId'>
          {
            isShort
              ? toShortAddress(address)
              : address
          }
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
*/

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

  protected renderAvailable () {
    const { accounts_idAndIndex = [], t, value, withAvailable } = this.props;
    const [_accountId] = accounts_idAndIndex;
    const accountId = _accountId || value;

    if (!withAvailable || !accountId) {
      return null;
    }

    return (
      <AvailableDisplay
        className='ui--AddressSummary-available'
        label={t('available ')}
        params={accountId}
      />
    );
  }

  protected renderUnlocking () {
    const { accounts_idAndIndex = [], value, withUnlocking } = this.props;
    const [_accountId] = accounts_idAndIndex;
    const accountId = _accountId || value;

    if (!withUnlocking || !accountId) {
      return null;
    }

    return (
      <UnlockingDisplay
        className='ui--AddressSummary-available'
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
