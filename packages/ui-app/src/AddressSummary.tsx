// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address } from '@polkadot/types';
import { I18nProps } from './types';

import BN from 'bn.js';
import { Label } from 'semantic-ui-react';
import React from 'react';
import { withCalls } from '@polkadot/ui-api';
import { Button, Input, InputTags } from '@polkadot/ui-app';
import BaseIdentityIcon from '@polkadot/ui-identicon';
import keyring from '@polkadot/ui-keyring';

import AvailableDisplay from './Available';
import BalanceDisplay from './Balance';
import BondedDisplay from './Bonded';
import { classes, getAddrName, getAddrTags, toShortAddress } from './util';
import CopyButton from './CopyButton';
import IdentityIcon from './IdentityIcon';
import NonceDisplay from './Nonce';
import translate from './translate';

export type Props = I18nProps & {
  accounts_idAndIndex?: [AccountId?, AccountIndex?],
  balance?: BN | Array<BN>,
  bonded?: BN | Array<BN>,
  buttons?: React.ReactNode,
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
  withTags?: boolean
};

type State = {
  address: string,
  isEditingName: boolean,
  isEditingTags: boolean,
  name: string,
  tags: string[]
};

const DEFAULT_ADDR = '5'.padEnd(16, 'x');
const ICON_SIZE = 64;

class AddressSummary extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = this.createState();
  }

  static defaultProps = {
    defaultName: '<unknown>'
  };

  static getDerivedStateFromProps ({ accounts_idAndIndex = [], defaultName, value }: Props, prevState: State): State | null {
    const [_accountId] = accounts_idAndIndex;
    const accountId = _accountId || value;
    const address = accountId
      ? accountId.toString()
      : DEFAULT_ADDR;
    const name = getAddrName(address, false, defaultName) || '';
    const tags = getAddrTags(address);
    const state = { tags } as State;
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
      ? state
      : null;
  }

  render () {
    const { accounts_idAndIndex = [], className, isInline, style, withIndex } = this.props;
    const [accountId, accountIndex] = accounts_idAndIndex;
    const isValid = accountId || accountIndex;

    return (
      <div
        className={classes('ui--AddressSummary', !isValid && 'invalid', isInline && 'inline', className)}
        style={style}
      >
        <div className='ui--AddressSummary-base'>
          {this.renderIcon()}
          {this.renderButtons()}
          <div className='ui--AddressSummary-data'>
            {this.renderName()}
            {this.renderAddress()}
            {this.renderAccountIndex(withIndex)}
          </div>
          <div className='ui--AddressSummary-balances'>
            {this.renderAvailable()}
            {this.renderBalance()}
            {this.renderBonded()}
            {this.renderNonce()}
          </div>
          {this.renderTags()}
        </div>
        {this.renderChildren()}
      </div>
    );
  }

  private createState () {
    const { accounts_idAndIndex = [], defaultName, value } = this.props;
    const [_accountId] = accounts_idAndIndex;
    const accountId = _accountId || value;
    const address = accountId
      ? accountId.toString()
      : DEFAULT_ADDR;
    const name = getAddrName(address, false, defaultName) || '';
    const tags = getAddrTags(address);

    return {
      address,
      isEditingName: false,
      isEditingTags: false,
      name,
      tags
    };
  }

  protected renderAddress () {
    const { isShort = true } = this.props;
    const { address } = this.state;
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

  protected renderButtons () {
    const { buttons } = this.props;

    return buttons
      ? <div className='ui--AddressSummary-buttons'>{buttons}</div>
      : null;
  }

  protected renderName () {
    const { isEditable } = this.props;
    const { isEditingName, name } = this.state;

    return isEditingName
      ? (
        <Input
          autoFocus
          defaultValue={name}
          onBlur={this.saveName}
          onChange={this.onChangeName}
          onEnter={this.saveName}
          withLabel={false}
        />
      )
      : (
        <div
          className={classes('ui--AddressSummary-name', isEditable && 'editable')}
          onClick={isEditable ? this.toggleNameEditor : undefined}
        >
          {name}
          {isEditable && this.renderEditIcon()}
        </div>
      );
  }

  protected onChangeName = (name: string) => {
    this.setState({ name });
  }

  protected onChangeTags = (tags: string[]) => {
    this.setState({ tags });
  }

  protected renderAvailable () {
    const { accounts_idAndIndex = [], t, withAvailable } = this.props;
    const [accountId] = accounts_idAndIndex;

    if (!withAvailable || !accountId) {
      return null;
    }

    return (
      <AvailableDisplay
        className='ui--AddressSummary-available'
        label={<label>{t('available')}</label>}
        params={accountId}
      />
    );
  }

  protected renderAccountIndex (withIndex?: boolean) {
    const { accounts_idAndIndex = [] } = this.props;
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
    const { accounts_idAndIndex = [], balance, t, withBalance } = this.props;
    const [accountId] = accounts_idAndIndex;

    if (!withBalance || !accountId) {
      return null;
    }

    return (
      <BalanceDisplay
        balance={balance}
        className='ui--AddressSummary-balance'
        label={<label>{t('total')}</label>}
        params={accountId}
      />
    );
  }

  protected renderBonded () {
    const { accounts_idAndIndex = [], bonded, t, withBonded } = this.props;
    const [accountId] = accounts_idAndIndex;

    if (!withBonded || !accountId) {
      return null;
    }

    return (
      <BondedDisplay
        bonded={bonded}
        className='ui--AddressSummary-bonded'
        label={<label>{t('bonded')}</label>}
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

  protected renderEditIcon () {
    return (
      <Button
        className='iconButton'
        icon='edit'
        size='mini'
        isPrimary
        key='unlock'
      />
    );
  }

  protected renderIcon (className: string = 'ui--AddressSummary-icon', size?: number) {
    const { accounts_idAndIndex = [], identIconSize = ICON_SIZE, withIcon = true } = this.props;
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
      <Component
        className={className}
        size={size || identIconSize}
        value={address}
      />
    );
  }

  protected renderNonce () {
    const { t, withNonce } = this.props;
    const { address } = this.state;

    if (!withNonce || !address) {
      return null;
    }

    return (
      <NonceDisplay
        className='ui--AddressSummary-nonce'
        label={<label>{t('transactions')}</label>}
        params={address}
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
              ? (isEditable ? <span className='addTags'>add tags</span> : undefined)
              : tags.map((tag) => {
                return (
                  <Label key={tag} size='tiny' color='grey'>
                    {tag}
                  </Label>
                );
              })
          }
          {isEditable && this.renderEditIcon()}
        </div>;

    return resultingDom;
  }

  protected saveName = () => {
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

  protected saveTags = () => {
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

  protected toggleNameEditor = () => {
    this.setState(({ isEditingName }) => ({
      isEditingName: !isEditingName
    }));
  }

  protected toggleTagsEditor = () => {
    this.setState(({ isEditingTags }) => ({
      isEditingTags: !isEditingTags
    }));
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
