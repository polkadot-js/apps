// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountInfo, DeriveBalancesAll } from '@polkadot/api-derive/types';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { ActionStatus } from '@polkadot/react-components/Status/types';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AddressSmall, AddressInfo, Button, ChainLock, Icon, InputTags, Input, LinkExternal, Forget, Menu, Popup, Tag } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';
import { formatNumber } from '@polkadot/util';

import Transfer from '../Accounts/modals/Transfer';
import { useTranslation } from '../translate';

interface Props {
  address: string;
  className?: string;
  filter: string;
  isFavorite: boolean;
  toggleFavorite: (address: string) => void;
}

const WITH_BALANCE = { available: true, bonded: true, free: true, locked: true, reserved: true, total: true };

const isEditable = true;

function Address ({ address, className, filter, isFavorite, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const api = useApi();
  const info = useCall<DeriveAccountInfo>(api.api.derive.accounts.info, [address]);
  const balancesAll = useCall<DeriveBalancesAll>(api.api.derive.balances.all, [address]);
  const [tags, setTags] = useState<string[]>([]);
  const [accName, setAccName] = useState('');
  const [current, setCurrent] = useState<KeyringAddress | null>(null);
  const [genesisHash, setGenesisHash] = useState<string | null>(null);
  const [isEditingName, toggleEditName] = useToggle();
  const [isEditingTags, toggleEditTags] = useToggle();
  const [isForgetOpen, toggleForget] = useToggle();
  const [isSettingPopupOpen, toggleTransfer] = useToggle();
  const [isTransferOpen, toggleSettingPopup] = useToggle();
  const [isVisible, setIsVisible] = useState(true);

  const _setTags = useCallback(
    (tags: string[]): void => setTags(tags.sort()),
    []
  );

  useEffect((): void => {
    const current = keyring.getAddress(address);

    setCurrent(current || null);
    setGenesisHash((current && current.meta.genesisHash) || null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect((): void => {
    const { identity, nickname } = info || {};

    if (api.api.query.identity && api.api.query.identity.identityOf) {
      if (identity?.display) {
        setAccName(identity.display);
      }
    } else if (nickname) {
      setAccName(nickname);
    }
  }, [api, info]);

  useEffect((): void => {
    const account = keyring.getAddress(address);

    _setTags(account?.meta?.tags || []);
    setAccName(account?.meta?.name || '');
  }, [_setTags, address]);

  useEffect((): void => {
    if (filter.length === 0) {
      setIsVisible(true);
    } else {
      const _filter = filter.toLowerCase();

      setIsVisible(
        tags.reduce((result: boolean, tag: string): boolean => {
          return result || tag.toLowerCase().includes(_filter);
        }, accName.toLowerCase().includes(_filter))
      );
    }
  }, [accName, filter, tags]);

  const _onForget = useCallback(
    (): void => {
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
    },
    [address, t]
  );

  const _onGenesisChange = useCallback(
    (genesisHash: string | null): void => {
      setGenesisHash(genesisHash);

      const account = keyring.getAddress(address);

      account && keyring.saveAddress(address, { ...account.meta, genesisHash });

      setGenesisHash(genesisHash);
    },
    [address]
  );

  const _onFavorite = useCallback(
    (): void => toggleFavorite(address),
    [address, toggleFavorite]
  );

  const _saveName = useCallback(
    (): void => {
      toggleEditName();

      const meta = { name: accName, whenEdited: Date.now() };

      if (address) {
        try {
          const currentKeyring = keyring.getPair(address);

          currentKeyring && keyring.saveAccountMeta(currentKeyring, meta);
        } catch (error) {
          keyring.saveAddress(address, meta);
        }
      }
    },
    [accName, address, toggleEditName]
  );

  const _saveTags = useCallback(
    (): void => {
      toggleEditTags();

      const meta = { tags, whenEdited: Date.now() };

      if (address) {
        try {
          const currentKeyring = keyring.getPair(address);

          currentKeyring && keyring.saveAccountMeta(currentKeyring, meta);
        } catch (error) {
          keyring.saveAddress(address, meta);
        }
      }
    },
    [address, tags, toggleEditTags]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <tr className={className}>
      <td className='favorite'>
        <Icon
          className={`${isFavorite && 'isSelected isColorHighlight'}`}
          name={isFavorite ? 'star' : 'star outline'}
          onClick={_onFavorite}
        />
      </td>
      <td className='address'>
        <AddressSmall
          onClickName={toggleEditName}
          overrideName={
            isEditingName
              ? (
                <Input
                  autoFocus
                  className='name--input'
                  defaultValue={accName}
                  onBlur={_saveName}
                  onChange={setAccName}
                  onEnter={_saveName}
                  withLabel={false}
                />
              )
              : undefined
          }
          toggle={isEditingName}
          value={address}
        />
        {address && current && (
          <>
            {isForgetOpen && (
              <Forget
                address={current.address}
                key='modal-forget-account'
                mode='address'
                onClose={toggleForget}
                onForget={_onForget}
              />
            )}
            {isTransferOpen && (
              <Transfer
                key='modal-transfer'
                onClose={toggleTransfer}
                recipientId={address}
              />
            )}
          </>
        )}
      </td>
      <td className='all'>
        {isEditingTags
          ? (
            <InputTags
              defaultValue={tags}
              onBlur={_saveTags}
              onChange={_setTags}
              onClose={_saveTags}
              openOnFocus
              searchInput={{ autoFocus: true }}
              value={tags}
              withLabel={false}
            />
          )
          : (
            <div
              className='tags--toggle'
              onClick={toggleEditTags}
            >
              {tags.length
                ? tags.map((tag): React.ReactNode => (
                  <Tag
                    key={tag}
                    label={tag}
                  />
                ))
                : <label>{t('no tags')}</label>
              }
            </div>
          )
        }
      </td>
      <td className='number'>
        {balancesAll && formatNumber(balancesAll.accountNonce)}
      </td>
      <td className='number'>
        <AddressInfo
          address={address}
          withBalance={WITH_BALANCE}
          withBalanceToggle
          withExtended={false}
        />
      </td>
      <td className='button'>
        <Button
          icon='paper plane'
          key='deposit'
          label={t('deposit')}
          onClick={toggleTransfer}
          size='small'
          tooltip={t('Send funds to this address')}
        />
        <Popup
          className='theme--default'
          isOpen={isSettingPopupOpen}
          onClose={toggleSettingPopup}
          trigger={
            <Button
              icon='setting'
              onClick={toggleSettingPopup}
              size='small'
            />
          }
        >
          <Menu
            onClick={toggleSettingPopup}
            text
            vertical
          >
            <Menu.Item
              disabled={!isEditable}
              onClick={toggleForget}
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
      <td className='mini'>
        <LinkExternal
          className='ui--AddressCard-exporer-link'
          data={address}
          type='address'
          withShort
        />
      </td>
    </tr>
  );
}

export default React.memo(styled(Address)`
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
`);
