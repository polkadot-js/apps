// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import { I18nProps } from '@polkadot/react-components/types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AddressCard, AddressInfo, Button, ChainLock, Forget, Menu, Popup } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';

import Transfer from '@polkadot/app-accounts/modals/Transfer';

import translate from './translate';

interface Props extends I18nProps {
  address: string;
  className?: string;
}

const WITH_BALANCE = { available: true, bonded: true, free: true, locked: true, reserved: true, total: true };
const WITH_EXTENDED = { nonce: true };

const isEditable = true;

function Address ({ address, className, t }: Props): React.ReactElement<Props> {
  const api = useApi();
  const [current, setCurrent] = useState<KeyringAddress | null>(null);
  const [genesisHash, setGenesisHash] = useState<string | null>(null);
  const [isForgetOpen, setIsForgetOpen] = useState(false);
  const [isSettingPopupOpen, setIsSettingPopupOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  useEffect((): void => {
    const current = keyring.getAddress(address);

    setCurrent(current || null);
    setGenesisHash((current && current.meta.genesisHash) || null);
  }, []);

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

  return (
    <AddressCard
      buttons={
        <div className='addresses--Address-buttons buttons'>
          <div className='actions'>
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
          </div>
        </div>
      }
      className={className}
      isEditable={isEditable}
      type='address'
      value={address}
      withExplorer
      withIndexOrAddress={false}
      withTags
    >
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
      <AddressInfo
        address={address}
        withBalance={WITH_BALANCE}
        withExtended={WITH_EXTENDED}
      />
    </AddressCard>
  );
}

export default translate(
  styled(Address)`
    .addresses--Address-buttons {
      text-align: right;
    }
  `
);
