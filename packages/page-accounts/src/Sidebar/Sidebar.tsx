// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useAccountInfo, useToggle } from '@polkadot/react-hooks';
import { colorLink } from '@polkadot/react-components/styles/theme';
import { AccountName, Button, Icon, IdentityIcon, Input, LinkExternal, Tags } from '@polkadot/react-components';

import Transfer from '../Accounts/modals/Transfer';
import { useTranslation } from '../translate';
import Balances from './Balances';
import Flags from './Flags';
import Identity from './Identity';
import Multisig from './Multisig';

interface Props {
  address: string;
  className?: string;
  onClose: () => void;
  onUpdateName: () => void;
}

function Sidebar ({ address, className = '', onClose, onUpdateName }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { accountIndex, flags, identity, isEditingName, isEditingTags, meta, name, onForgetAddress, onSaveName, onSaveTags, setName, setTags, tags, toggleIsEditingName, toggleIsEditingTags } = useAccountInfo(address);
  const [isHoveringButton, toggleIsHoveringButton] = useToggle();
  const [isTransferOpen, toggleIsTransferOpen] = useToggle();

  const _onForgetAddress = useCallback(
    (): void => {
      onForgetAddress();
      onUpdateName && onUpdateName();
    },
    [onForgetAddress, onUpdateName]
  );

  const _onUpdateName = useCallback(
    (): void => {
      onSaveName();
      onUpdateName && onUpdateName();
    },
    [onSaveName, onUpdateName]
  );

  return (
    <div className={className}>
      <Button
        className='ui--AddressMenu-close'
        icon='times'
        isBasic
        isCircular
        onClick={onClose}
      />
      <div className='ui--AddressMenu-header'>
        <IdentityIcon
          size={80}
          value={address}
        />
        <div className='ui--AddressMenu-addr'>
          {address}
        </div>
        {accountIndex && (
          <div className='ui--AddressMenu-addr'>
            {accountIndex}
          </div>
        )}
        <AccountName
          onClick={(flags.isEditable && !isEditingName) ? toggleIsEditingName : undefined}
          override={
            isEditingName
              ? (
                <Input
                  autoFocus
                  className='name--input'
                  defaultValue={name}
                  onBlur={(flags.isInContacts || flags.isOwned) ? _onUpdateName : undefined}
                  onChange={setName}
                  withLabel={false}
                />
              )
              : flags.isEditable
                ? (name.toUpperCase() || t<string>('<unknown>'))
                : undefined
          }
          value={address}
          withSidebar={false}
        >
          {(!isEditingName && flags.isEditable) && (
            <Icon
              className='inline-icon'
              icon='edit'
            />
          )}
        </AccountName>
        <div className='ui--AddressMenu-tags'>
          <Tags
            isEditable
            isEditing={isEditingTags}
            onChange={setTags}
            onSave={onSaveTags}
            onToggleIsEditing={toggleIsEditingTags}
            size='tiny'
            value={tags}
          />
        </div>
        <Flags flags={flags} />
        <div className='ui-AddressMenu--button'>
          <Button.Group>
            <Button
              icon='paper-plane'
              label={t<string>('Send')}
              onClick={toggleIsTransferOpen}
            />
            {flags.isOwned && (
              <Button
                icon='check'
                isBasic
                label={t<string>('Owned')}
                onMouseEnter={toggleIsHoveringButton}
                onMouseLeave={toggleIsHoveringButton}
              />
            )}
            {!flags.isOwned && !flags.isInContacts && (
              <Button
                icon='plus'
                isPositive
                label={t<string>('Save')}
                onClick={_onUpdateName}
                onMouseEnter={toggleIsHoveringButton}
                onMouseLeave={toggleIsHoveringButton}
              />
            )}
            {!flags.isOwned && flags.isInContacts && (
              <Button
                className='ui--AddressMenu-button'
                icon='ban'
                isNegative={isHoveringButton}
                isPositive={!isHoveringButton}
                label={t<string>('Remove')}
                onClick={_onForgetAddress}
                onMouseEnter={toggleIsHoveringButton}
                onMouseLeave={toggleIsHoveringButton}
              />
            )}
          </Button.Group>
          {isTransferOpen && (
            <Transfer
              key='modal-transfer'
              onClose={toggleIsTransferOpen}
              recipientId={address}
            />
          )}
        </div>
      </div>
      <Balances address={address} />
      <Identity
        address={address}
        identity={identity}
      />
      <Multisig
        isMultisig={flags.isMultisig}
        meta={meta}
      />
      <section>
        <LinkExternal
          data={address}
          type='address'
        />
      </section>
    </div>
  );
}

export default React.memo(styled(Sidebar)`
  bottom: 0;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  max-width: 24rem;
  background: #f5f4f3;
  padding: 1rem;
  box-shadow: -6px 0px 20px 0px rgba(0,0,0,0.2);
  z-index: 999;

  input {
    width: auto !important;
  }

  .ui--AddressMenu-close {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
  }

  .ui--AddressMenu-header {
    align-items: center;
    background: white;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: -1rem -1rem 1rem -1rem;
    padding: 1rem;

    .ui--Button {
      transition: 0.5s all;
    }
  }

  .ui--AddressMenu-addr {
    font-family: monospace;
    margin: 0.5rem 0;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    width: 100%;
  }

  .ui--AddressMenu-addr+.ui--AddressMenu-addr {
    margin-top: -0.25rem;
  }

  section {
    &:not(:last-child) {
      margin-bottom: 1.4rem;
    }

    .ui--AddressMenu-sectionHeader {
      display: inline-flex;
      color: #aaa;
      margin-bottom: 0.4rem;
      width: 100%;

      & > :first-child {
        flex: 1;
      }
    }
  }

  .ui--AddressMenu-identity {
    .ui--AddressMenu-identityTable {
      font-size: 0.93rem;
      margin-top: 0.3rem;

      .tr {
        display: inline-flex;
        align-items: center;
        width: 100%;

        .th {
          font-weight: bold;
          text-align: right;
          flex-basis: 20%;
        }

        .td {
          flex: 1;
          overflow: hidden;
          padding-left: 0.6rem;
          text-overflow: ellipsis;
        }
      }
    }

    .parent {
      padding: 0 !important;
    }
  }

  .ui--AddressMenu-tags,
  .ui--AddressMenu-flags {
    margin-bottom: 0.75rem;
  }

  .ui--AddressMenu-flags {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;

    > * {
      margin-bottom: 0.4rem;

      &:not(:first-child) {
        margin-left: 1rem;
        margin-right: 0;
      }
    }
  }

  .ui--AddressMenu-identityIcon {
    background: ${colorLink}66;
  }

  .ui--AddressMenu-actions {
    ul {
      list-style-type: none;
      margin-block-start: 0;
      margin-block-end: 0;
      padding-inline-start: 1rem;

      li {
        margin: 0.2rem 0;
      }
    }
  }

  .tags--toggle {
    display: inline-block;
  }

  .inline-icon {
    cursor: pointer;
    margin: 0 0 0 0.5rem;
    color:  ${colorLink};
  }

  .name--input {
    .ui.input {
      margin: 0 !important;

      > input {
        padding: 0 !important;
        background: rgba(230, 230, 230, 0.8) !important;
        border: 0 !important;
        border-radius: 0 !important;
        box-shadow: 0 3px 3px rgba(0,0,0,.2);
      }
    }
  }
`);
