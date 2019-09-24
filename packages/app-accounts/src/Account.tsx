// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActionStatus } from '@polkadot/react-components/Status/types';
import { I18nProps } from '@polkadot/react-components/types';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AddressCard, AddressInfo, Button, ChainLock, Forget } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';

import Backup from './modals/Backup';
import ChangePass from './modals/ChangePass';
import Transfer from './modals/Transfer';
import translate from './translate';

interface Props extends I18nProps {
  address: string;
  className?: string;
}

function Account ({ address, className, t }: Props): React.ReactElement<Props> {
  const [genesisHash, setGenesisHash] = useState<string | null>(null);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isExternal, setIsExternal] = useState(false);
  const [isForgetOpen, setIsForgetOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  useEffect((): void => {
    const account = keyring.getAccount(address);

    setGenesisHash((account && account.meta.genesisHash) || null);
    setIsEditable((account && !(account.meta.isInjected || account.meta.isHardware)) || false);
    setIsExternal((account && account.meta.isExternal) || false);
  }, [address]);

  const _toggleBackup = (): void => setIsBackupOpen(!isBackupOpen);
  const _toggleForget = (): void => setIsForgetOpen(!isForgetOpen);
  const _togglePass = (): void => setIsPasswordOpen(!isPasswordOpen);
  const _toggleTransfer = (): void => setIsTransferOpen(!isTransferOpen);
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
  };

  // FIXME It is a bit heavy-handled switching of being editable here completely
  // (and removing the tags, however the keyring cannot save these)
  return (
    <AddressCard
      buttons={
        <div className='accounts--Account-buttons buttons'>
          <div className='actions'>
            {isEditable && (
              <Button
                isNegative
                onClick={_toggleForget}
                icon='trash'
                size='small'
                tooltip={t('Forget this account')}
              />
            )}
            {isEditable && !isExternal && (
              <>
                <Button
                  icon='cloud download'
                  isPrimary
                  onClick={_toggleBackup}
                  size='small'
                  tooltip={t('Create a backup file for this account')}
                />
                <Button
                  icon='key'
                  isPrimary
                  onClick={_togglePass}
                  size='small'
                  tooltip={t("Change this account's password")}
                />
              </>
            )}
            <Button
              icon='paper plane'
              isPrimary
              label={t('send')}
              onClick={_toggleTransfer}
              size='small'
              tooltip={t('Send funds from this account')}
            />
          </div>
          {isEditable && !isExternal && (
            <div className='others'>
              <ChainLock
                genesisHash={genesisHash}
                onChange={_onGenesisChange}
              />
            </div>
          )}
        </div>
      }
      className={className}
      isEditable={isEditable}
      type='account'
      value={address}
      withExplorer
      withIndex
      withTags
    >
      {address && (
        <>
          {isBackupOpen && (
            <Backup
              key='modal-backup-account'
              onClose={_toggleBackup}
              address={address}
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
        </>
      )}
      <AddressInfo
        address={address}
        withBalance
        withExtended
      />
    </AddressCard>
  );
}

export default translate(
  styled(Account)`
    .accounts--Account-buttons {
      text-align: right;

      .others {
        margin-right: 0.125rem;
        margin-top: 0.25rem;
      }
    }
  `
);
