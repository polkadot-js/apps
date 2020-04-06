// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AddressIdentity } from '@polkadot/react-hooks/types';
import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import { BareProps } from './types';

import BN from 'bn.js';
import React from 'react';
import { Label } from 'semantic-ui-react';
import styled from 'styled-components';
import { KeyringItemType } from '@polkadot/ui-keyring/types';
import { useAccountInfo, useApi, useToggle } from '@polkadot/react-hooks';
import Transfer from '@polkadot/app-accounts/modals/Transfer';

import { classes, toShortAddress } from './util';
import { colorLink } from './styles/theme';
import AddressMini from './AddressMini';
import AddressSmall from './AddressSmall';
import AvatarItem from './AvatarItem';
import Badge from './Badge';
import Button from './Button';
import Icon from './Icon';
import IconLink from './IconLink';
import Input from './Input';
import InputTags from './InputTags';
import LinkExternal from './LinkExternal';
import Popup from './Popup';
import Spinner from './Spinner';
import Tooltip from './Tooltip';
import BondedDisplay from './Bonded';
import IdentityIcon from './IdentityIcon';
import LockedVote from './LockedVote';

import { useTranslation } from './translate';

const DISPLAYED_FLAGS = ['isCouncil', 'isSociety', 'isTechCommittee', 'isSudo', 'isDevelopment', 'isExternal'];

interface Props extends BareProps {
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  value?: AccountId | Address | string | null | Uint8Array;
}

function AddressMenu ({ className, isOpen, onClose, value, children, style }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const accountInfo = useAccountInfo(value);
  const [isHoveringButton, toggleIsHoveringButton] = useToggle();
  const [isTransferOpen, toggleIsTransferOpen] = useToggle();

  if (!accountInfo) {
    return null;
  }

  const _toggleTransfer = (): void => {
    onClose && onClose();
    toggleIsTransferOpen();
  };

  let content: React.ReactNode;
  if (!accountInfo.isReady) {
    content = (
      <Spinner />
    );
  } else {
    const {
      // identity,
      isReady,
      name,
      setName,
      tags,
      setTags,
      genesisHash,
      setGenesisHash,
      isEditingName,
      toggleIsEditingName,
      isEditingTags,
      toggleIsEditingTags,
      onSaveName,
      onSaveTags,
      onForgetAddress,
      isInAddressBook,
      isOwned,
      isEditable,
      isDevelopment,
      isExternal,
      isCouncil,
      isSociety,
      isSudo,
      isTechCommittee
    } = accountInfo;

    const hasFlags = [isDevelopment, isExternal, isSociety, isCouncil, isTechCommittee, isSudo].reduce(
      (result: boolean, value: boolean): boolean => result || value,
      false
    );

    const identity: AddressIdentity = {
      isGood: false,
      isBad: false,
      isExistent: true,
      judgements: [],
      waitCount: 0,
      parent: '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy',
      display: 'Keith Ingram',
      legal: 'Parity Technologies',
      twitter: 'keith',
      riot: 'keith:matrix.org',
      web: 'https://keithingram.info'
    };

    const buttonProps = {
      onMouseEnter: toggleIsHoveringButton,
      onMouseLeave: toggleIsHoveringButton
    };

    content = (
      <div
        className={classes('ui--AddressMenu', className)}
        style={style}
      >
        <div className='ui--AddressMenu-header'>
          <AddressSmall
            className='ui--AddressMenu-address'
            overrideName={
              isEditingName
                ? (
                  <Input
                    className='name--input'
                    autoFocus
                    defaultValue={name}
                    onChange={setName}
                    onEnter={(isInAddressBook || isOwned) ? onSaveName : undefined}
                    withLabel={false}
                  />
                )
                : undefined
            }
            onClickName={isEditable && toggleIsEditingName}
            toggle={isEditingName}
            value={value}
            withIndex
          >
            {(!isEditingName && isEditable) && (
              <Icon
                name='edit'
                className='inline-icon'
              />
            )}
          </AddressSmall>
          <div className='ui--AddressMenu-tags'>
            {isEditingTags
              ? (
                <InputTags
                  onBlur={onSaveTags}
                  onChange={setTags}
                  onClose={onSaveTags}
                  openOnFocus
                  defaultValue={tags}
                  searchInput={{ autoFocus: true }}
                  value={tags}
                  withLabel={false}
                />
              )
              : (
                <div className='tags--toggle' onClick={toggleIsEditingTags}>
                  {tags.length
                    ? tags.map((tag): React.ReactNode => (
                      <Label key={tag} size='tiny' color='grey'>{tag}</Label>
                    ))
                    : <label>{t('no tags')}</label>
                  }
                </div>
              )
            }
            {(!isEditingTags && isEditable) && (
              <Icon
                name='edit'
                onClick={toggleIsEditingTags}
                className='inline-icon'
              />
            )}
          </div>
          <div className='ui-AddressMenu--button'>
            {isOwned && (
              <Button
                icon='check'
                className='basic'
                isPrimary
                size='tiny'
                {...buttonProps}
              >
                {t('Owned')}
              </Button>
            )}
            {!isOwned && !isInAddressBook && (
              <Button
                icon='add'
                isPositive
                onClick={onSaveName}
                size='tiny'
                {...buttonProps}
              >
                {t('Add to address book')}
              </Button>
            )}
            {!isOwned && isInAddressBook && (
              <Button
                isAnimated
                className={`ui--AddressMenu-button icon ${isHoveringButton ? '' : 'basic'}`}
                isPositive={!isHoveringButton}
                isNegative={isHoveringButton}
                onClick={onForgetAddress}
                size='tiny'
                {...buttonProps}
              >
                <Button.Content visible>
                  <Icon name='check' />
                  {' '}
                  {t('In address book')}
                </Button.Content>
                <Button.Content hidden>
                  <Icon name='ban' />
                  {' '}
                  {t('Remove')}
                </Button.Content>
              </Button>
            )}
          </div>
        </div>
        {true && (
          <div className='ui--AddressMenu-section ui--AddressMenu-identity'>
            <div className='ui--AddressMenu-sectionHeader'>
              <div>
                <Icon name='address card' />
                {' '}
                {t('identity')}
              </div>
              {identity?.isExistent && (
                <Label
                  size='tiny'
                  color={
                    identity.isGood
                      ? 'green'
                      : identity.isBad
                        ? 'red'
                        : 'yellow'
                  }
                >
                  <b>{identity.judgements.length}</b>
                  <Label.Detail>
                    {identity.isGood ? t('Valid') : (identity.isBad ? t('Disputed') : t('No judgments'))}
                  </Label.Detail>
                </Label>
              )}

            </div>
            <div>
              {identity?.isExistent
                ? (
                  <>
                    <AvatarItem
                      icon={
                        identity.image
                          ? (
                            <img src={identity.image} />
                          )
                          : (
                            <i className='icon user ui--AddressMenu-identityIcon' />
                          )
                      }
                      title={identity.display}
                      subtitle={identity.legal}
                    />
                    <div className='ui--AddressMenu-identityTable'>
                      {identity.parent && (
                        <div className='tr parent'>
                          <div className='th'>{t('parent')}</div>
                          <div className='td'>
                            <AddressMini isPadded={false} isFlex value={identity.parent} />
                          </div>
                        </div>
                      )}
                      {identity.email && (
                        <div className='tr'>
                          <div className='th'>{t('email')}</div>
                          <div className='td'>
                            <a rel='noopener noreferrer' target='_blank' href={`mailto:${identity.email}`}>
                              {identity.email}
                            </a>
                          </div>
                        </div>
                      )}
                      {identity.web && (
                        <div className='tr'>
                          <div className='th'>{t('website')}</div>
                          <div className='td'>
                            <a rel='noopener noreferrer' target='_blank' href={identity.web}>
                              {identity.web}
                            </a>
                          </div>
                        </div>
                      )}
                      {identity.twitter && (
                        <div className='tr'>
                          <div className='th'>{t('twitter')}</div>
                          <div className='td'>
                            <a rel='noopener noreferrer' target='_blank' href={`https://twitter.com/${identity.twitter}`}>
                              @{identity.twitter}
                            </a>
                          </div>
                        </div>
                      )}
                      {identity.riot && (
                        <div className='tr'>
                          <div className='th'>{t('riot')}</div>
                          <div className='td'>
                            @{identity.riot}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )
                : t('none found')
              }
            </div>
          </div>
        )}
        {hasFlags && (
          <div className='ui--AddressMenu-section'>
            <div className='ui--AddressMenu-sectionHeader'>
              <div>
                <Icon name='tag' />
                {' '}
                {t('flags')}
              </div>
            </div>
            <div className='ui--AddressMenu-flags'>
              {isExternal && (
                <Label size='tiny' tag color='grey'>{t('Injected')}</Label>
              )}
              {isDevelopment && (
                <Label size='tiny' tag color='grey'>{t('Test account')}</Label>
              )}
              {isCouncil && (
                <Label size='tiny' tag color='blue'>{t('Council')}</Label>
              )}
              {isSociety && (
                <Label size='tiny' tag color='green'>{t('Society')}</Label>
              )}
              {isTechCommittee && (
                <Label size='tiny' tag color='orange'>{t('Technical committee')}</Label>
              )}
              {isSudo && (
                <Label size='tiny' tag color='pink'>{t('Sudo key')}</Label>
              )}
            </div>
          </div>
        )}
        <div className='ui--AddressMenu-section'>
          <div className='ui--AddressMenu-sectionHeader'>
            <div>
              <Icon name='share square' />
              {' '}
              {t('actions')}
            </div>
          </div>
          <div className='ui--AddressMenu-actions'>
            <ul>
              <li>
                <IconLink
                  icon='send'
                  label={t('Transfer funds')}
                  onClick={_toggleTransfer}
                />
              </li>
              <li>
                <LinkExternal
                  className='ui--AddressCard-exporer-link'
                  data={value}
                  type='address'
                  withShort
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Popup
        onClose={onClose}
        on='click'
        open={isOpen}
        trigger={children}
      >
        {content}
      </Popup>
      {isTransferOpen && (
        <Transfer
          key='modal-transfer'
          onClose={_toggleTransfer}
          recipientId={value}
        />
      )}
    </>
  );
}

export default React.memo(styled(AddressMenu)`
  min-width: 16rem;

  input {
    width: auto !important;
  }

  .ui--AddressMenu-header {
    margin-bottom: 2rem;
    border-bottom: 1px solid #eee;

    .ui.button {
      width: 100%;
      transition: 0.5s all;
    }
  }

  .ui--AddressMenu-section {
    margin-bottom: 1.4rem;

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
          padding-left: 0.6rem;
          flex: 1;
        }
      }

    }
  }

  .ui--AddressMenu-tags {
    margin-bottom: 1rem;
  }

  .ui--AddressMenu-flags {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;

    > * {
      margin-bottom: 0.2rem;

      &:not(:last-child) {
        margin-right: 0.2rem;
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
    }
  }

  .tags--toggle {
    display: inline-block;
  }

  .inline-icon {
    cursor: pointer;
    margin: 0 0 0 0.6rem;
    color: rgba(200, 200, 200, 0.8);
  }

  &:hover {
    .inline-icon {
      color: ${colorLink}
    }
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
