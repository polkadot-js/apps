// Copyright 2017-2023 @polkadot/app-addresses authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { KeyringAddress } from '@polkadot/ui-keyring/types';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import Transfer from '@polkadot/app-accounts/modals/Transfer';
import { AddressInfo, AddressSmall, Button, ChainLock, Columar, ExpandButton, Forget, Icon, LinkExternal, Menu, Popup, Tags } from '@polkadot/react-components';
import { useApi, useBalancesAll, useDeriveAccountInfo, useToggle } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { isFunction } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  address: string;
  className?: string;
  filter: string;
  isFavorite: boolean;
  toggleFavorite: (address: string) => void;
}

const isEditable = true;

const BALANCE_OPTS = {
  available: true,
  bonded: true,
  locked: true,
  nonce: true,
  redeemable: true,
  reserved: true,
  total: false,
  unlocking: true,
  vested: true
};

const BALANCE_OPTS_ONLY = {
  available: false,
  bonded: false,
  locked: false,
  redeemable: false,
  reserved: false,
  total: true,
  unlocking: false,
  vested: false
};

function Address ({ address, className = '', filter, isFavorite, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const api = useApi();
  const info = useDeriveAccountInfo(address);
  const balancesAll = useBalancesAll(address);
  const [tags, setTags] = useState<string[]>([]);
  const [accName, setAccName] = useState('');
  const [current, setCurrent] = useState<KeyringAddress | null>(null);
  const [genesisHash, setGenesisHash] = useState<string | null>(null);
  const [isForgetOpen, setIsForgetOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, toggleIsExpanded] = useToggle(false);

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

    if (isFunction(api.api.query.identity?.identityOf)) {
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

  const PopupDropdown = (
    <Menu>
      <Menu.Item
        isDisabled={!isEditable}
        label={t<string>('Forget this address')}
        onClick={_toggleForget}
      />
      {isEditable && !api.isDevelopment && (
        <>
          <Menu.Divider />
          <ChainLock
            className='addresses--network-toggle'
            genesisHash={genesisHash}
            onChange={_onGenesisChange}
          />
        </>
      )}
    </Menu>
  );

  return (
    <>
      <tr className={`${className}${isExpanded ? ' noBorder' : ''}`}>
        <td className='favorite'>
          <Icon
            color={isFavorite ? 'orange' : 'gray'}
            icon='star'
            onClick={_onFavorite}
          />
        </td>
        <td className='address all'>
          <AddressSmall
            value={address}
            withShortAddress
          />
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
        <td className='balance'>
          <AddressInfo
            address={address}
            balancesAll={balancesAll}
            withBalance={BALANCE_OPTS_ONLY}
            withExtended={false}
          />
        </td>
        <td className='actions'>
          <div>
            {isFunction(api.api.tx.balances?.transfer) && (
              <Button
                className='send-button'
                icon='paper-plane'
                key='send'
                label={t<string>('send')}
                onClick={_toggleTransfer}
              />
            )}
            <Popup value={PopupDropdown} />
            <ExpandButton
              expanded={isExpanded}
              onClick={toggleIsExpanded}
            />
          </div>
        </td>
      </tr>
      <tr className={`${className} ${isExpanded ? 'isExpanded' : 'isCollapsed'}`}>
        <td />
        <td className='columar'>
          <Columar is100>
            <Columar.Column>
              <LinkExternal
                data={address}
                type='address'
                withTitle
              />
            </Columar.Column>
          </Columar>
          <Columar>
            <Columar.Column>
              <div data-testid='tags'>
                <Tags
                  value={tags}
                  withTitle
                />
              </div>
            </Columar.Column>
          </Columar>
        </td>
        <td className='top'>
          <AddressInfo
            address={address}
            balancesAll={balancesAll}
            withBalance={BALANCE_OPTS}
            withExtended={false}
          />
        </td>
        <td colSpan={2} />
      </tr>
    </>
  );
}

// FIXME: This is weird, if we remove the styled wrapper we have test failures...
export default React.memo(styled(Address)``);
