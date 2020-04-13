// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Address } from '@polkadot/types/interfaces';
import { BareProps } from './types';

import React from 'react';
import { Label } from 'semantic-ui-react';
import styled from 'styled-components';
import { useAccountInfo, useApi, useRegistrars, useToggle } from '@polkadot/react-hooks';
// import Transfer from '@polkadot/app-accounts/Accounts/modals/Transfer';
import polkascan from '@polkadot/apps-config/links/polkascan';

import { classes } from './util';
import { colorLink } from './styles/theme';
import AccountNameJudgement from './AccountNameJudgement';
import AddressMini from './AddressMini';
import AddressSmall from './AddressSmall';
import AvatarItem from './AvatarItem';
import Button from './Button';
import Icon from './Icon';
import IconLink from './IconLink';
import Input from './Input';
import InputTags from './InputTags';
import Popup from './Popup';
import Transfer from './Transfer';

import { useTranslation } from './translate';

interface Props extends BareProps {
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  value: AccountId | Address | string | Uint8Array;
}

function AddressMenu ({ children, className, isOpen, onClose, style, value }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api, systemChain } = useApi();
  const { registrars } = useRegistrars();
  const accountInfo = useAccountInfo(value);
  const [isHoveringButton, toggleIsHoveringButton] = useToggle();
  const [isTransferOpen, toggleIsTransferOpen] = useToggle();
  const [isJudgementOpen, toggleIsJudgementOpen] = useToggle();

  if (!accountInfo) {
    return null;
  }

  const useIdentity = !!api.query.identity?.identityOf;

  const _toggleTransfer = (): void => {
    onClose && onClose();
    toggleIsTransferOpen();
  };

  const _toggleJudgement = (): void => {
    onClose && onClose();
    toggleIsJudgementOpen();
  };

  // let content: React.ReactNode;
  // if (!accountInfo.isReady) {
  //   content = (
  //     <Spinner />
  //   );
  // } else {
  const {
    identity,
    isCouncil,
    isDevelopment,
    isEditable,
    isEditingName,
    isEditingTags,
    isExternal,
    isInAddressBook,
    isOwned,
    isSociety,
    isSudo,
    isTechCommittee,
    name,
    onForgetAddress,
    onSaveName,
    onSaveTags,
    setName,
    setTags,
    tags,
    toggleIsEditingName,
    toggleIsEditingTags
  } = accountInfo;

  const _addToAddressBook = (): void => {
    // toggleIsHoveringButton();
    onSaveName();
  };

  const hasFlags = [isDevelopment, isExternal, isSociety, isCouncil, isTechCommittee, isSudo].reduce(
    (result: boolean, value: boolean): boolean => result || value,
    false
  );

  // const identity: AddressIdentity = {
  //   isGood: false,
  //   isBad: false,
  //   isExistent: true,
  //   judgements: [],
  //   waitCount: 0,
  //   parent: '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy',
  //   display: 'Keith Ingram',
  //   legal: 'Parity Technologies',
  //   twitter: 'keith',
  //   riot: 'keith:matrix.org',
  //   web: 'https://keithingram.info'
  // };

  const buttonProps = {
    onMouseEnter: toggleIsHoveringButton,
    onMouseLeave: toggleIsHoveringButton
  };

  const content = (
    <div
      className={classes('ui--AddressMenu', className)}
      style={style}
    >
      <div className='ui--AddressMenu-header'>
        <AddressSmall
          className='ui--AddressMenu-address'
          onClickName={isEditable && toggleIsEditingName}
          overrideName={
            isEditingName
              ? (
                <Input
                  autoFocus
                  className='name--input'
                  defaultValue={name}
                  onChange={setName}
                  onEnter={(isInAddressBook || isOwned) ? onSaveName : undefined}
                  withLabel={false}
                />
              )
              : undefined
          }
          toggle={isEditingName}
          value={value}
          withIndex
        >
          {(!isEditingName && isEditable) && (
            <Icon
              className='inline-icon'
              name='edit'
            />
          )}
        </AddressSmall>
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
                    <Label
                      color='grey'
                      key={tag}
                      size='tiny'
                    >
                      {tag}
                    </Label>
                  ))
                  : <label>{t('no tags')}</label>
                }
              </div>
            )
          }
          {(!isEditingTags && isEditable) && (
            <Icon
              className='inline-icon'
              name='edit'
              onClick={toggleIsEditingTags}
            />
          )}
        </div>
        <div className='ui-AddressMenu--button'>
          {isOwned && (
            <Button
              className='basic'
              icon='check'
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
              onClick={_addToAddressBook}
              size='tiny'
              {...buttonProps}
            >
              {t('Add to address book')}
            </Button>
          )}
          {!isOwned && isInAddressBook && (
            <Button
              className={`ui--AddressMenu-button icon ${isHoveringButton ? '' : 'basic'}`}
              isAnimated
              isNegative={isHoveringButton}
              isPositive={!isHoveringButton}
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
      {useIdentity && (
        <div className='ui--AddressMenu-section ui--AddressMenu-identity'>
          <div className='ui--AddressMenu-sectionHeader'>
            <div>
              <Icon name='address card' />
              {' '}
              {t('identity')}
            </div>
            {identity?.isExistent && (
              <Label
                color={
                  identity.isGood
                    ? 'green'
                    : identity.isBad
                      ? 'red'
                      : 'yellow'
                }
                size='tiny'
              >
                <b>{identity.judgements.length}</b>
                <Label.Detail>
                  {
                    identity.judgements.length
                      ? (identity.isGood
                        ? (identity.isKnownGood ? t('Known good') : t('Reasonable'))
                        : (identity.isErroneous ? t('Erroneous') : t('Low quality'))
                      )
                      : t('No judgments')
                  }
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
                    subtitle={identity.legal}
                    title={identity.display}
                  />
                  <div className='ui--AddressMenu-identityTable'>
                    {identity.parent && (
                      <div className='tr parent'>
                        <div className='th'>{t('parent')}</div>
                        <div className='td'>
                          <AddressMini
                            isFlex
                            isPadded={false}
                            value={identity.parent}
                            withMenu
                          />
                        </div>
                      </div>
                    )}
                    {identity.email && (
                      <div className='tr'>
                        <div className='th'>{t('email')}</div>
                        <div className='td'>
                          <a
                            href={`mailto:${identity.email}`}
                            rel='noopener noreferrer'
                            target='_blank'
                          >
                            {identity.email}
                          </a>
                        </div>
                      </div>
                    )}
                    {identity.web && (
                      <div className='tr'>
                        <div className='th'>{t('website')}</div>
                        <div className='td'>
                          <a
                            href={identity.web.replace(/^(https?:\/\/)?/g, 'https://')}
                            rel='noopener noreferrer'
                            target='_blank'
                          >
                            {identity.web}
                          </a>
                        </div>
                      </div>
                    )}
                    {identity.twitter && (
                      <div className='tr'>
                        <div className='th'>{t('twitter')}</div>
                        <div className='td'>
                          <a
                            href={`https://twitter.com/${identity.twitter}`}
                            rel='noopener noreferrer'
                            target='_blank'
                          >
                            {identity.twitter}
                          </a>
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
              <Label
                color='grey'
                size='tiny'
                tag
              >
                {t('Injected')}
              </Label>
            )}
            {isDevelopment && (
              <Label
                color='grey'
                size='tiny'
                tag
              >
                {t('Test account')}
              </Label>
            )}
            {isCouncil && (
              <Label
                color='blue'
                size='tiny'
                tag
              >
                {t('Council')}
              </Label>
            )}
            {isSociety && (
              <Label
                color='green'
                size='tiny'
                tag
              >
                {t('Society')}
              </Label>
            )}
            {isTechCommittee && (
              <Label
                color='orange'
                size='tiny'
                tag
              >
                {t('Technical committee')}
              </Label>
            )}
            {isSudo && (
              <Label
                color='pink'
                size='tiny'
                tag
              >
                {t('Sudo key')}
              </Label>
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
        {!!value && (
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
                <IconLink
                  icon='address card'
                  label={t('Add identity judgment')}
                  onClick={_toggleJudgement}
                />
              </li>
              <li>
                <IconLink
                  href={polkascan.create(polkascan.chains[systemChain as 'Kusama'], polkascan.paths.address, value.toString())}
                  icon='external'
                  label={t('View on Polkascan')}
                  rel='noopener noreferrer'
                  target='_blank'
                />
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Popup
        isOpen={isOpen}
        on='click'
        onClose={onClose}
        position='bottom left'
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
      {(!!value && isJudgementOpen && useIdentity) && (
        <AccountNameJudgement
          address={value.toString()}
          key='modal-judgement'
          registrars={registrars}
          toggleJudgement={_toggleJudgement}
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
