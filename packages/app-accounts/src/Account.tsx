// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActionStatus } from '@polkadot/react-components/Status/types';
import { I18nProps } from '@polkadot/react-components/types';

import React, { useState, useEffect } from 'react';
import { Label } from 'semantic-ui-react';
import styled from 'styled-components';
import { AddressInfo, AddressSmall, Button, ChainLock, Forget, Icon, InputTags, LinkPolkascan, Menu, Popup, Input } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';

import Backup from './modals/Backup';
import ChangePass from './modals/ChangePass';
import Derive from './modals/Derive';
import Transfer from './modals/Transfer';
import translate from './translate';

interface Props extends I18nProps {
  address: string;
  allowTags: string[];
  className?: string;
  isFavorite: boolean;
  toggleFavorite: (address: string) => void;
}

function Account ({ address, allowTags, className, isFavorite, t, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const api = useApi();
  const [tags, setTags] = useState<string[]>([]);
  const [accName, setAccName] = useState('');
  const [genesisHash, setGenesisHash] = useState<string | null>(null);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [{ isDevelopment, isEditable, isExternal }, setFlags] = useState({ isDevelopment: false, isEditable: false, isExternal: false });
  const [isDeriveOpen, setIsDeriveOpen] = useState(false);
  const [isForgetOpen, setIsForgetOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isSettingPopupOpen, setIsSettingPopupOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect((): void => {
    const account = keyring.getAccount(address);

    setGenesisHash((account && account.meta.genesisHash) || null);
    setFlags({
      isDevelopment: (account && account.meta.isTesting) || false,
      isEditable: (account && !(account.meta.isInjected || account.meta.isHardware)) || false,
      isExternal: (account && account.meta.isExternal) || false
    });
    setTags(account?.meta?.tags || []);
    setAccName(account?.meta?.name || '');
  }, [address]);

  useEffect((): void => {
    if (allowTags.length === 0) {
      setIsVisible(true);
    } else {
      setIsVisible(
        allowTags.reduce((result: boolean, tag: string): boolean => {
          return result || tags.includes(tag);
        }, false)
      );
    }
  }, [allowTags, tags]);

  if (!isVisible) {
    return null;
  }

  const _toggleEditName = (): void => setIsEditingName(!isEditingName);
  const _toggleEditTags = (): void => setIsEditingTags(!isEditingTags);
  const _toggleBackup = (): void => setIsBackupOpen(!isBackupOpen);
  const _toggleDerive = (): void => setIsDeriveOpen(!isDeriveOpen);
  const _toggleForget = (): void => setIsForgetOpen(!isForgetOpen);
  const _togglePass = (): void => setIsPasswordOpen(!isPasswordOpen);
  const _toggleSettingPopup = (): void => setIsSettingPopupOpen(!isSettingPopupOpen);
  const _toggleTransfer = (): void => setIsTransferOpen(!isTransferOpen);
  const _saveName = (): void => {
    _toggleEditName();

    const meta = { name: accName, whenEdited: Date.now() };

    if (address) {
      try {
        const currentKeyring = keyring.getPair(address);

        currentKeyring && keyring.saveAccountMeta(currentKeyring, meta);
      } catch (error) {
        keyring.saveAddress(address, meta);
      }
    }
  };
  const _saveTags = (): void => {
    _toggleEditTags();

    const meta = { tags, whenEdited: Date.now() };

    if (address) {
      try {
        const currentKeyring = keyring.getPair(address);

        currentKeyring && keyring.saveAccountMeta(currentKeyring, meta);
      } catch (error) {
        keyring.saveAddress(address, meta);
      }
    }
  };
  const _onForget = (): void => {
    if (!address) {
      return;
    }

    const status: Partial<ActionStatus> = {
      account: address,
      action: 'forget'
    };

    try {
      keyring.forgetAccount(address);
      status.status = 'success';
      status.message = t('account forgotten');
    } catch (error) {
      status.status = 'error';
      status.message = error.message;
    }
  };
  const _onGenesisChange = (genesisHash: string | null): void => {
    const account = keyring.getPair(address);

    account && keyring.saveAccountMeta(account, { ...account.meta, genesisHash });

    setGenesisHash(genesisHash);
  };
  const _onFavorite = (): void => toggleFavorite(address);

  return (
    <tr className={className}>
      <td className='favorite'>
        <Icon
          className={`${isFavorite && 'isSelected'}`}
          name={isFavorite ? 'star' : 'star outline'}
          onClick={_onFavorite}
        />
      </td>
      <td className='top'>
        <AddressSmall
          overrideName={
            isEditingName
              ? (
                <Input
                  className='name--input'
                  autoFocus
                  defaultValue={accName}
                  onBlur={_saveName}
                  onChange={setAccName}
                  onEnter={_saveName}
                  withLabel={false}
                />
              )
              : undefined
          }
          onClickName={_toggleEditName}
          toggle={isEditingName}
          value={address}
        />
        {isBackupOpen && (
          <Backup
            address={address}
            key='modal-backup-account'
            onClose={_toggleBackup}
          />
        )}
        {isDeriveOpen && (
          <Derive
            from={address}
            key='modal-derive-account'
            onClose={_toggleDerive}
          />
        )}
        {isForgetOpen && (
          <Forget
            address={address}
            onForget={_onForget}
            key='modal-forget-account'
            onClose={_toggleForget}
          />
        )}
        {isPasswordOpen && (
          <ChangePass
            address={address}
            key='modal-change-pass'
            onClose={_togglePass}
          />
        )}
        {isTransferOpen && (
          <Transfer
            key='modal-transfer'
            onClose={_toggleTransfer}
            senderId={address}
          />
        )}
      </td>
      <td className='top'>
        {isEditingTags
          ? (
            <InputTags
              onBlur={_saveTags}
              onChange={setTags}
              onClose={_saveTags}
              openOnFocus
              defaultValue={tags}
              searchInput={{ autoFocus: true }}
              value={tags}
              withLabel={false}
            />
          )
          : (
            <div className='tags--toggle' onClick={_toggleEditTags}>
              {tags.length
                ? tags.map((tag): React.ReactNode => (
                  <Label key={tag} size='tiny' color='grey'>{tag}</Label>
                ))
                : <label>{t('no tags')}</label>
              }
            </div>
          )
        }
      </td>
      <td className='top'>
        <AddressInfo
          address={address}
          withBalance
          withBalanceToggle
          withExtended={false}
        />
      </td>
      <td className='top'>
        <AddressInfo
          address={address}
          withBalance={false}
          withExtended
        />
      </td>
      <td className='number top'>
        <Button
          icon='paper plane'
          isPrimary
          label={t('send')}
          onClick={_toggleTransfer}
          size='small'
          tooltip={t('Send funds from this account')}
        />
        <Popup
          className='theme--default'
          onClose={_toggleSettingPopup}
          open={isSettingPopupOpen}
          position='bottom right'
          trigger={
            <Button
              icon='setting'
              onClick={_toggleSettingPopup}
              size='small'
            />
          }
        >
          <Menu
            vertical
            text
            onClick={_toggleSettingPopup}
          >
            <Menu.Item
              disabled={!isEditable || isExternal}
              onClick={_toggleDerive}
            >
              {t('Derive account from source')}
            </Menu.Item>
            <Menu.Item disabled>
              {t('Change on-chain nickname')}
            </Menu.Item>
            <Menu.Item
              disabled={!isEditable || isExternal || isDevelopment}
              onClick={_toggleBackup}
            >
              {t('Create a backup file for this account')}
            </Menu.Item>
            <Menu.Item
              disabled={!isEditable || isExternal || isDevelopment}
              onClick={_togglePass}
            >
              {t("Change this account's password")}
            </Menu.Item>
            <Menu.Item
              disabled={!isEditable || isDevelopment}
              onClick={_toggleForget}
            >
              {t('Forget this account')}
            </Menu.Item>
            {!api.isDevelopment && (
              <>
                <Menu.Divider />
                <ChainLock
                  className='accounts--network-toggle'
                  genesisHash={genesisHash}
                  onChange={_onGenesisChange}
                  preventDefault
                />
              </>
            )}
          </Menu>
        </Popup>
      </td>
      <td className='mini top'>
        <LinkPolkascan
          className='ui--AddressCard-exporer-link'
          data={address}
          type='address'
          withShort
        />
      </td>
    </tr>
  );
}

export default translate(
  styled(Account)`
    .accounts--Account-buttons {
      text-align: right;
    }

    .tags--toggle {
      cursor: pointer;
      width: 100%;
      min-height: 1.5rem;

      label {
        cursor: pointer;
      }
    }

    .name--input {
      width: 16rem;
    }
  `
);
