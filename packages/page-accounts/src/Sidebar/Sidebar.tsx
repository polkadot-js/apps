// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';
import styled from 'styled-components';

import { AccountName, Button, Icon, IdentityIcon, Input, LinkExternal, Sidebar, Tags } from '@polkadot/react-components';
import { colorLink } from '@polkadot/react-components/styles/theme';
import { useAccountInfo, useToggle } from '@polkadot/react-hooks';

import Transfer from '../modals/Transfer';
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

function FullSidebar ({ address, className = '', onClose, onUpdateName }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { accountIndex, flags, identity, isEditingName, isEditingTags, meta, name, onForgetAddress, onSaveName, onSaveTags, setName, setTags, tags, toggleIsEditingName, toggleIsEditingTags } = useAccountInfo(address);
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
    <Sidebar
      className={className}
      onClose={onClose}
      position='right'
    >
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
        <div className='ui--AddressMenu-buttons'>
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
              />
            )}
            {!flags.isOwned && !flags.isInContacts && (
              <Button
                icon='plus'
                label={t<string>('Save')}
                onClick={_onUpdateName}
              />
            )}
            {!flags.isOwned && flags.isInContacts && (
              <Button
                icon='ban'
                label={t<string>('Remove')}
                onClick={_onForgetAddress}
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
    </Sidebar>
  );
}

export default React.memo(styled(FullSidebar)`
  input {
    width: auto !important;
  }

  .ui--AddressMenu-header {
    align-items: center;
    background: var(--bg-tabs);
    border-bottom: 1px solid var(--border-table);
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: -1rem -1rem 1rem -1rem;
    padding: 1rem;
  }

  .ui--AddressMenu-addr {
    font: var(--font-mono);
    margin: 0.75rem 0;
    text-align: center;
    word-break: break-all;
    width: 26ch;
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
      color: var(--color-text);
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
          font-weight: var(--font-weight-normal);
          text-align: right;
          flex-basis: 20%;

          &.top {
            align-self: flex-start;
          }
        }

        .td {
          flex: 1;
          overflow: hidden;
          padding-left: 0.6rem;
          text-overflow: ellipsis;
        }
      }
    }

    .parent, .subs {
      padding: 0 !important;
    }
  }

  .ui--AddressMenu-buttons {
    .ui--Button-Group {
      margin-bottom: 0;
    }
  }

  .ui--AddressMenu-tags,
  .ui--AddressMenu-flags {
    margin: 0.75rem 0 0;
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
