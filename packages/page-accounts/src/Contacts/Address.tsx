// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountInfo, DeriveBalancesAll } from '@polkadot/api-derive/types';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { ActionStatus } from '@polkadot/react-components/Status/types';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AddressSmall, AddressInfo, Button, ChainLock, Icon, LinkExternal, Forget, Menu, Popup, Tags } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';
import { BN_ZERO, formatNumber } from '@polkadot/util';

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

function Address ({ address, className = '', filter, isFavorite, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const api = useApi();
  const info = useCall<DeriveAccountInfo>(api.api.derive.accounts.info, [address]);
  const balancesAll = useCall<DeriveBalancesAll>(api.api.derive.balances.all, [address]);
  const [tags, setTags] = useState<string[]>([]);
  const [accName, setAccName] = useState('');
  const [current, setCurrent] = useState<KeyringAddress | null>(null);
  const [genesisHash, setGenesisHash] = useState<string | null>(null);
  const [isForgetOpen, setIsForgetOpen] = useState(false);
  const [isSettingPopupOpen, setIsSettingPopupOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
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

    _setTags(account?.meta?.tags as string[] || []);
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

  const _toggleForget = useCallback(
    (): void => setIsForgetOpen(!isForgetOpen),
    [isForgetOpen]
  );

  const _toggleSettingPopup = useCallback(
    (): void => setIsSettingPopupOpen(!isSettingPopupOpen),
    [isSettingPopupOpen]
  );

  const _toggleTransfer = useCallback(
    (): void => setIsTransferOpen(!isTransferOpen),
    [isTransferOpen]
  );

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
          status.message = t<string>('address forgotten');
        } catch (error) {
          status.status = 'error';
          status.message = (error as Error).message;
        }
      }
    },
    [address, t]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <tr className={className}>
      <td className='favorite'>
        <Icon
          color={isFavorite ? 'orange' : 'gray'}
          icon='star'
          onClick={_onFavorite}
        />
      </td>
      <td className='address'>
        <AddressSmall value={address} />
        {address && current && (
          <>
            {isForgetOpen && (
              <Forget
                address={current.address}
                key='modal-forget-account'
                mode='address'
                onClose={_toggleForget}
                onForget={_onForget}
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
      <td className='all'>
        <div className='tags'>
          <Tags value={tags} />
        </div>
      </td>
      <td className='number ui--media-1500'>
        {balancesAll?.accountNonce.gt(BN_ZERO) && formatNumber(balancesAll.accountNonce)}
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
          icon='paper-plane'
          key='send'
          label={t<string>('send')}
          onClick={_toggleTransfer}
        />
        <Popup
          className='theme--default'
          isOpen={isSettingPopupOpen}
          onClose={_toggleSettingPopup}
          trigger={
            <Button
              icon='ellipsis-v'
              onClick={_toggleSettingPopup}
            />
          }
        >
          <Menu
            onClick={_toggleSettingPopup}
            text
            vertical
          >
            <Menu.Item
              disabled={!isEditable}
              onClick={_toggleForget}
            >
              {t<string>('Forget this address')}
            </Menu.Item>
            <Menu.Divider />
            <ChainLock
              className='addresses--network-toggle'
              genesisHash={genesisHash}
              isDisabled={!isEditable || api.isDevelopment}
              onChange={_onGenesisChange}
            />
          </Menu>
        </Popup>
      </td>
      <td className='mini ui--media-1400'>
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
  .tags {
    width: 100%;
    min-height: 1.5rem;
  }
`);
