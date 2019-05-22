// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address } from '@polkadot/types';
import { I18nProps } from './types';

import BN from 'bn.js';
import { Label } from 'semantic-ui-react';
import React from 'react';
import BaseIdentityIcon from '@polkadot/ui-identicon';
import { Button, Input, InputTags } from '@polkadot/ui-app';
import keyring from '@polkadot/ui-keyring';
import { withCalls } from '@polkadot/ui-api';

import AvailableDisplay from './Available';
import BalanceDisplay from './Balance';
import BondedDisplay from './Bonded';
import { classes, getAddrName, toShortAddress } from './util';
import CopyButton from './CopyButton';
import IdentityIcon from './IdentityIcon';
import NonceDisplay from './Nonce';
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
  withIcon?: boolean,
  withIndex?: boolean,
  withNonce?: boolean,
  withTags?: boolean,
  withUnlocking?: boolean
};

type State = {
  isEditingName: boolean
  isEditingTags: boolean
  name: string
  tags: string[]
};

const DEFAULT_ADDR = '5'.padEnd(16, 'x');

class AddressSummary extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);
    this.state = this.createState();
  }

  createState () {
    const { accounts_idAndIndex = [], defaultName, value } = this.props;
    const [_accountId] = accounts_idAndIndex;
    const accountId = _accountId || value;
    const address = accountId
    ? accountId.toString()
    : DEFAULT_ADDR;
    const name = getAddrName(address, false, defaultName) || '';
    const tags = this.getAddressTags(address);

    return {
      isEditingName: false,
      isEditingTags: false,
      name,
      tags: tags
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
            {this.renderAccountIndex()}
          </div>
          <div className='ui--AddressSummary-balances'>
            {this.renderAvailable()}
            {this.renderBalance()}
            {this.renderBonded()}
            {this.renderNonce()}
            {this.renderUnlocking()}
          </div>
          {this.renderTags()}
        </div>
        {this.renderChildren()}
      </div>
    );
  }

  protected getAddressTags (address: string): Array<string> {
    try {
      if (keyring.getAccount(address).isValid()) {
        const addressKeyring = address && keyring.getPair(address);
        return addressKeyring && addressKeyring.getMeta().tags || [];
      }
    } catch (error) {
      // all-ok, we have empty fallbacks
    }

    return [];
  }

  protected renderAddress () {
    const { isShort = true, value } = this.props;

    const address = value
      ? value.toString()
      : DEFAULT_ADDR;

    const addrElem = isShort
    ? (
        <CopyButton
          isAddress
          value={address}
        >
          <span>{toShortAddress(address)}</span>
        </CopyButton>
    )
    : address;

    return (
      <>
        <div className='ui--AddressSummary-name'>
          {name}
        </div>
        <div className='ui--AddressSummary-accountId'>
          {addrElem}
        </div>
      </>
    );
  }

  protected renderName () {
    const { isEditable } = this.props;
    const { isEditingName, name } = this.state;

    const resultingDom = isEditingName ?
      <>
        <Input
          autoFocus
          defaultValue={name}
          className='full'
          onBlur={this.saveName}
          onChange={this.onChangeName}
          onEnter={this.saveName}
          withLabel={false}
        />
      </>
       :
        <div
          className={classes('ui--AddressSummary-name', isEditable && 'editable')}
          onClick={isEditable ? this.toggleNameEditor : undefined}
        >
          {name}
          {isEditable && this.renderEditIcon(this.toggleNameEditor)}
        </div>;

    return resultingDom;
  }

  protected onChangeName = (name: string) => {
    this.setState({ name });
  }

  protected onChangeTags = (tags: string[]) => {
    this.setState({ tags : tags });
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

  protected renderAccountIndex () {
    const { accounts_idAndIndex = [], withIndex = true } = this.props;
    const [, accountIndex] = accounts_idAndIndex;

    if (!accountIndex || !withIndex) {
      return null;
    }

    return (
        <div className='ui--AddressSummary-accountIndex'>
          {accountIndex.toString()}
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

  protected renderEditIcon (callback: () => void) {

    return (
      <Button
        className='editButton'
        onClick={callback}
        icon='edit'
        size='mini'
        isPrimary
        key='unlock'
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
      <NonceDisplay
        className='ui--AddressSummary-nonce'
        label={t('transactions ')}
        params={accountId}
      />
    );
  }

  protected renderSaveIcon (callback: () => void) {
    return (
    <Button
      className='saveButton'
      onClick={callback}
      icon='save'
      size='small'
      isPrimary
      key='save'
    />
    );
  }

  protected renderTags () {
    const { isEditingTags, tags } = this.state;
    const { isEditable, withTags = false } = this.props;

    if (!withTags) {
      return null;
    }

    const resultingDom = isEditingTags ?
      <>
        <InputTags
          className='ui--AddressSummary-tags-input'
          onBlur={this.saveTags}
          onChange={this.onChangeTags}
          onClose={this.saveTags}
          openOnFocus
          defaultValue = {tags}
          searchInput={{ autoFocus: true }}
          value={tags}
          withLabel={false}
        />
      </>
       :
        <div
          className={classes('ui--AddressSummary-tags', isEditable && 'editable')}
          onClick={isEditable ? this.toggleTagsEditor : undefined}
        >
          {
            !tags.length
            ? <span>add tags</span>
            : tags.map((tag) => {
              return (
                <Label key={tag} size='tiny' color='grey'>
                  {tag}
                </Label>
              );
            })
          }
          {isEditable && this.renderEditIcon(this.toggleTagsEditor)}
        </div>;

    return resultingDom;
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

  protected saveName = () => {
    const { value } = this.props;
    const { name } = this.state;

    const trimmedName = name.trim();

    // Save only if the name was changed or if it's no empty.
    if (trimmedName && value) {
      const currentKeyring = keyring.getPair(value.toString());
      currentKeyring && keyring.saveAccountMeta(currentKeyring, { name: trimmedName, whenEdited: Date.now() });
      this.toggleNameEditor();
    }
  }

  protected saveTags = () => {
    const { value } = this.props;
    const { tags } = this.state;

    if (value) {
      const currentKeyring = keyring.getPair(value.toString());
      currentKeyring && keyring.saveAccountMeta(currentKeyring, { tags, whenEdited: Date.now() });
      this.toggleTagsEditor();
    }
  }

  protected toggleNameEditor = () => {
    const { value } = this.props;

    if (value && keyring.getPair(value.toString())) {
      this.setState({ isEditingName : !this.state.isEditingName });
    }
  }

  protected toggleTagsEditor = () => {
    this.setState({ isEditingTags : !this.state.isEditingTags });
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
