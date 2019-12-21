// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import { I18nProps } from '@polkadot/react-components/types';

import React, { useEffect, useState } from 'react';
import { Label } from 'semantic-ui-react';
import styled from 'styled-components';
import { AddressSmall, AddressInfo, Button, ChainLock, Icon, InputTags, Input, LinkPolkascan, Forget, Menu, Popup } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';

import Transfer from '@polkadot/app-accounts/modals/Transfer';

import translate from './translate';

interface Props extends I18nProps {
  address: string;
  allowTags: string[];
  className?: string;
  isFavorite: boolean;
  toggleFavorite: (address: string) => void;
}

const WITH_BALANCE = { available: true, bonded: true, free: true, locked: true, reserved: true, total: true };
const WITH_EXTENDED = { nonce: true };

const isEditable = true;

function Address ({ address, allowTags, className, isFavorite, t, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const api = useApi();
  const [tags, setTags] = useState<string[]>([]);
  const [accName, setAccName] = useState('');
  const [current, setCurrent] = useState<KeyringAddress | null>(null);
  const [genesisHash, setGenesisHash] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [isForgetOpen, setIsForgetOpen] = useState(false);
  const [isSettingPopupOpen, setIsSettingPopupOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const _setTags = (tags: string[]): void => setTags(tags.sort());

  useEffect((): void => {
    const current = keyring.getAddress(address);

    setCurrent(current || null);
    setGenesisHash((current && current.meta.genesisHash) || null);
  }, []);

  useEffect((): void => {
    const account = keyring.getAddress(address);

    _setTags(account?.meta?.tags || []);
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
  const _toggleForget = (): void => setIsForgetOpen(!isForgetOpen);
  const _toggleSettingPopup = (): void => setIsSettingPopupOpen(!isSettingPopupOpen);
  const _toggleTransfer = (): void => setIsTransferOpen(!isTransferOpen);
  const _onForget = (): void => {
    if (address) {
      const status: Partial<ActionStatus> = {
        account: address,
        action: 'forget'
      };

      try {
        keyring.forgetAddress(address);
        status.status = 'success';
        status.message = t('address forgotten');
      } catch (error) {
        status.status = 'error';
        status.message = error.message;
      }
    }
  };
  const _onGenesisChange = (genesisHash: string | null): void => {
    setGenesisHash(genesisHash);

    const account = keyring.getAddress(address);

    account && keyring.saveAddress(address, { ...account.meta, genesisHash });

    setGenesisHash(genesisHash);
  };
  const _onFavorite = (): void => toggleFavorite(address);
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
        {address && current && (
          <>
            {isForgetOpen && (
              <Forget
                address={current.address}
                onForget={_onForget}
                key='modal-forget-account'
                mode='address'
                onClose={_toggleForget}
              />
            )}
            {isTransferOpen && (
              <Transfer
                key='modal-transfer'
                onClose={_toggleTransfer}
                recipientId={address}
              />
            )}
          </>
        )}
      </td>
      <td className='top'>
        {isEditingTags
          ? (
            <InputTags
              onBlur={_saveTags}
              onChange={_setTags}
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
          withBalance={WITH_BALANCE}
          withBalanceToggle
          withExtended={false}
        />
      </td>
      <td className='top'>
        <AddressInfo
          address={address}
          withBalance={false}
          withExtended={WITH_EXTENDED}
        />
      </td>
      <td className='number top'>
        <Button
          icon='paper plane'
          isPrimary
          key='deposit'
          label={t('deposit')}
          onClick={_toggleTransfer}
          size='small'
          tooltip={t('Send funds to this address')}
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
              disabled={!isEditable}
              onClick={_toggleForget}
            >
              {t('Forget this address')}
            </Menu.Item>
            {!api.isDevelopment && (
              <>
                <Menu.Divider />
                <ChainLock
                  className='addresses--network-toggle'
                  genesisHash={genesisHash}
                  isDisabled={!isEditable}
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
  styled(Address)`
    .addresses--Address-buttons {
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
