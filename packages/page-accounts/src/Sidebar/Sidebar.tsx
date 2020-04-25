// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';

import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useAccountInfo, useApi, useRegistrars, useToggle } from '@polkadot/react-hooks';
import { classes } from '@polkadot/react-components/util';
import { colorLink } from '@polkadot/react-components/styles/theme';
import { AccountName, AddressMini, AvatarItem, Button, Icon, IconLink, IdentityIcon, Input, InputTags, LinkExternal, Tag, Transfer } from '@polkadot/react-components';
import { isHex } from '@polkadot/util';

import { useTranslation } from '../translate';
import Flags from './Flags';
import RegistrarJudgement from './RegistrarJudgement';

interface Props extends BareProps {
  address: string;
  onClose: () => void;
  onUpdateName: () => void;
}

function Sidebar ({ address, className, onClose, onUpdateName, style }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { isRegistrar, registrars } = useRegistrars();
  const { flags, identity, isEditingName, isEditingTags, name, onForgetAddress, onSaveName, onSaveTags, setName, setTags, tags, toggleIsEditingName, toggleIsEditingTags } = useAccountInfo(address);
  const [isHoveringButton, toggleIsHoveringButton] = useToggle();
  const [isTransferOpen, toggleIsTransferOpen] = useToggle();
  const [isJudgementOpen, toggleIsJudgementOpen] = useToggle();

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

  const useIdentity = !!api.query.identity?.identityOf;

  return (
    <>
      <div
        className={classes('ui--AddressMenu', className)}
        style={style}
      >
        <Button
          className='ui--AddressMenu-close'
          icon='close'
          isBasic
          isCircular
          onClick={onClose}
        />
        <div className='ui--AddressMenu-header'>
          <IdentityIcon
            size={80}
            value={address.toString()}
          />
          <div className='ui--AddressMenu-addr'>
            {address.toString()}
          </div>
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
                  ? (name.toUpperCase() || t('<unknown>'))
                  : undefined
            }
            value={address}
            withSidebar={false}
          >
            {(!isEditingName && flags.isEditable) && (
              <Icon
                className='inline-icon'
                name='edit'
              />
            )}
          </AccountName>
          <div className='ui--AddressMenu-tags'>
            {isEditingTags
              ? (
                <InputTags
                  defaultValue={tags}
                  onBlur={onSaveTags}
                  onChange={setTags}
                  onClose={onSaveTags}
                  openOnFocus
                  searchInput={{ autoFocus: true }}
                  value={tags}
                  withLabel={false}
                />
              )
              : (
                <div
                  className='tags--toggle'
                  onClick={toggleIsEditingTags}
                >
                  {tags.length
                    ? tags.map((tag): React.ReactNode => (
                      <Tag
                        color='grey'
                        key={tag}
                        label={tag}
                        size='tiny'
                      />
                    ))
                    : <label>{t('no tags')}</label>
                  }
                </div>
              )
            }
            {(!isEditingTags && (flags.isInContacts || flags.isOwned)) && (
              <Icon
                className='inline-icon'
                name='edit'
                onClick={toggleIsEditingTags}
              />
            )}
          </div>
          <Flags flags={flags} />
          <div className='ui-AddressMenu--button'>
            <Button.Group>
              <Button
                icon='send'
                label={t('Deposit')}
                onClick={toggleIsTransferOpen}
              />
              {flags.isOwned && (
                <Button
                  className='basic'
                  icon='check'
                  isPrimary
                  label={t('Owned')}
                  onMouseEnter={toggleIsHoveringButton}
                  onMouseLeave={toggleIsHoveringButton}
                  size='tiny'
                />
              )}
              {!flags.isOwned && !flags.isInContacts && (
                <Button
                  icon='add'
                  isPositive
                  label={t('Save')}
                  onClick={_onUpdateName}
                  onMouseEnter={toggleIsHoveringButton}
                  onMouseLeave={toggleIsHoveringButton}
                  size='tiny'
                />
              )}
              {!flags.isOwned && flags.isInContacts && (
                <Button
                  className={`ui--AddressMenu-button icon ${isHoveringButton ? '' : 'basic'}`}
                  isAnimated
                  isNegative={isHoveringButton}
                  isPositive={!isHoveringButton}
                  onClick={_onForgetAddress}
                  onMouseEnter={toggleIsHoveringButton}
                  onMouseLeave={toggleIsHoveringButton}
                  size='tiny'
                >
                  <Button.Content visible>
                    <Icon name='check' />
                    &nbsp;
                    {t('Saved')}
                  </Button.Content>
                  <Button.Content hidden>
                    <Icon name='ban' />
                    &nbsp;
                    {t('Remove')}
                  </Button.Content>
                </Button>
              )}
            </Button.Group>
          </div>
        </div>
        {useIdentity && identity?.isExistent && (
          <div className='ui--AddressMenu-section ui--AddressMenu-identity'>
            <div className='ui--AddressMenu-sectionHeader'>
              <div>
                <Icon name='address card' />
                &nbsp;
                {t('identity')}
              </div>
              <Tag
                color={
                  identity.isGood
                    ? 'green'
                    : identity.isBad
                      ? 'red'
                      : 'yellow'
                }
                isTag={false}
                label={
                  <>
                    <b>{identity.judgements.length}&nbsp;</b>
                    {
                      identity.judgements.length
                        ? (identity.isGood
                          ? (identity.isKnownGood ? t('Known good') : t('Reasonable'))
                          : (identity.isErroneous ? t('Erroneous') : t('Low quality'))
                        )
                        : t('No judgments')
                    }
                  </>
                }
                size='tiny'
              />
            </div>
            <div>
              <AvatarItem
                icon={
                  // This won't work - images are IPFS hashes
                  // identity.image
                  //   ? <img src={identity.image} />
                  //   : <i className='icon user ui--AddressMenu-identityIcon' />
                  //
                  <i className='icon user ui--AddressMenu-identityIcon' />
                }
                subtitle={identity.legal}
                title={identity.display}
              />
              <div className='ui--AddressMenu-identityTable'>
                {identity.parent && (
                  <div className='tr parent'>
                    <div className='th'>{t('parent')}</div>
                    <div className='td'>
                      <AddressMini
                        className='parent'
                        isPadded={false}
                        value={identity.parent}
                      />
                    </div>
                  </div>
                )}
                {identity.email && (
                  <div className='tr'>
                    <div className='th'>{t('email')}</div>
                    <div className='td'>
                      {isHex(identity.email)
                        ? identity.email
                        : (
                          <a
                            href={`mailto:${identity.email}`}
                            rel='noopener noreferrer'
                            target='_blank'
                          >
                            {identity.email}
                          </a>
                        )}
                    </div>
                  </div>
                )}
                {identity.web && (
                  <div className='tr'>
                    <div className='th'>{t('website')}</div>
                    <div className='td'>
                      {isHex(identity.web)
                        ? identity.web
                        : (
                          <a
                            href={(identity.web as string).replace(/^(https?:\/\/)?/g, 'https://')}
                            rel='noopener noreferrer'
                            target='_blank'
                          >
                            {identity.web}
                          </a>
                        )}
                    </div>
                  </div>
                )}
                {identity.twitter && (
                  <div className='tr'>
                    <div className='th'>{t('twitter')}</div>
                    <div className='td'>
                      {isHex(identity.twitter)
                        ? identity.twitter
                        : (
                          <a
                            href={`https://twitter.com/${identity.twitter}`}
                            rel='noopener noreferrer'
                            target='_blank'
                          >
                            {identity.twitter}
                          </a>
                        )}
                    </div>
                  </div>
                )}
                {identity.riot && (
                  <div className='tr'>
                    <div className='th'>{t('riot')}</div>
                    <div className='td'>
                      {identity.riot}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {address && identity?.isExistent && isRegistrar && (
          <div className='ui--AddressMenu-section'>
            <div className='ui--AddressMenu-actions'>
              <ul>
                <li>
                  <IconLink
                    icon='address card'
                    label={t('Add identity judgment')}
                    onClick={toggleIsJudgementOpen}
                  />
                </li>
              </ul>
            </div>
          </div>
        )}
        <div className='ui--AddressMenu-section'>
          <LinkExternal
            data={address}
            type='address'
          />
        </div>
      </div>
      {isTransferOpen && (
        <Transfer
          key='modal-transfer'
          onClose={toggleIsTransferOpen}
          recipientId={address}
        />
      )}
      {(!!address && isJudgementOpen && isRegistrar && useIdentity) && (
        <RegistrarJudgement
          address={address}
          key='modal-judgement'
          registrars={registrars}
          toggleJudgement={toggleIsJudgementOpen}
        />
      )}
    </>
  );
}

export default React.memo(styled(Sidebar)`
  bottom: 0;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  max-width: 24rem;
  background: #f5f5f5;
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
    font-size: 1.2rem;
    padding: 0.6rem !important;
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

    .ui.button {
      transition: 0.5s all;

      &.secondary {
        background-color: #666;
      }
    }

    .ui.button+.ui.button {
      margin-left: 0.25rem !important;
    }
  }

  .ui--AddressMenu-addr {
    font-family: monospace;
    margin: 0.5rem 0;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  .ui--AddressMenu-section {
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
      font-size: 13px;
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
    margin: 0 0 0 0.6rem;
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
