// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountInfo } from '@polkadot/api-derive/types';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import { RecoveryConfig } from '@polkadot/types/interfaces';

import React, { useState, useEffect } from 'react';
import { Label } from 'semantic-ui-react';
import styled from 'styled-components';
import { AddressSmall, Badge, Forget, Icon, IdentityIcon, InputTags, LinkPolkascan, Input, Button, Modal } from '@polkadot/react-components';
import AddressInfo from './AddressInfoMvp';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';
import keyring from '@polkadot/ui-keyring';
import { formatBalance, formatNumber } from '@polkadot/util';

import Backup from './modals/Backup';
import ChangePass from './modals/ChangePass';
import Derive from './modals/Derive';
import Identity from './modals/Identity';
import RecoverAccount from './modals/RecoverAccount';
import RecoverSetup from './modals/RecoverSetup';
import Transfer from '../../app-generic-asset/src/Transfer';
import { useTranslation } from './translate';

interface Props {
  address: string;
  className?: string;
  filter: string;
  isFavorite: boolean;
  toggleFavorite: (address: string) => void;
}

function Account ({ address, className, filter, isFavorite, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const api = useApi();
  const info = useCall<DeriveAccountInfo>(api.api.derive.accounts.info as any, [address]);
  const recoveryInfo = useCall<RecoveryConfig | null>(api.api.query.recovery?.recoverable, [address], {
    transform: (opt: Option<RecoveryConfig>): RecoveryConfig | null =>
      opt.unwrapOr(null)
  });
  const [tags, setTags] = useState<string[]>([]);
  const [accName, setAccName] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [isEditingName, toggleEditName] = useToggle();
  const [isEditingTags, toggleEditTags] = useToggle();
  const [isBackupOpen, toggleBackup] = useToggle();
  const [isDeriveOpen, toggleDerive] = useToggle();
  const [isForgetOpen, toggleForget] = useToggle();
  const [isIdentityOpen, toggleIdentity] = useToggle();
  const [isPasswordOpen, togglePassword] = useToggle();
  const [isRecoverAccountOpen, toggleRecoverAccount] = useToggle();
  const [isRecoverSetupOpen, toggleRecoverSetup] = useToggle();
  const [isTransferOpen, toggleTransfer] = useToggle();

  const _setTags = (tags: string[]): void => setTags(tags.sort());

  useEffect((): void => {
    const { identity, nickname } = info || {};

    if (api.api.query.identity && api.api.query.identity.identityOf) {
      if (identity?.display) {
        setAccName(identity.display);
      }
    } else if (nickname) {
      setAccName(nickname);
    }
  }, [info]);

  useEffect((): void => {
    const account = keyring.getAccount(address);

    _setTags(account?.meta?.tags as string[] || []);
    setAccName(account?.meta.name || '');
  }, [address]);

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

  if (!isVisible) {
    return null;
  }

  const _saveName = (): void => {
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
  };
  const _saveTags = (): void => {
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
      <td className='together'>
        {recoveryInfo && (
          <Badge
            hover={
              <div>
                <p>{t('This account is recoverable, with the following friends:')}</p>
                <div>
                  {recoveryInfo.friends.map((friend, index): React.ReactNode => (
                    <IdentityIcon
                      key={index}
                      size={24}
                      value={friend}
                    />
                  ))}
                </div>
                <table>
                  <tbody>
                    <tr>
                      <td>{t('threshold')}</td>
                      <td>{formatNumber(recoveryInfo.threshold)}</td>
                    </tr>
                    <tr>
                      <td>{t('delay')}</td>
                      <td>{formatNumber(recoveryInfo.delayPeriod)}</td>
                    </tr>
                    <tr>
                      <td>{t('deposit')}</td>
                      <td>{formatBalance(recoveryInfo.deposit)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            }
            info={<Icon name='shield' />}
            isInline
            isTooltip
            type='online'
          />
        )}
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
            ) : (
              undefined
            )
          }
          onClickName={toggleEditName}
          toggle={isEditingName}
          value={address}
        />
        {isBackupOpen && (
          <Backup
            address={address}
            key='modal-backup-account'
            onClose={toggleBackup}
          />
        )}
        {isDeriveOpen && (
          <Derive
            from={address}
            key='modal-derive-account'
            onClose={toggleDerive}
          />
        )}
        {isForgetOpen && (
          <Forget
            address={address}
            onForget={_onForget}
            key='modal-forget-account'
            onClose={toggleForget}
          />
        )}
        {isIdentityOpen && (
          <Identity
            address={address}
            key='modal-identity'
            onClose={toggleIdentity}
          />
        )}
        {isPasswordOpen && (
          <ChangePass
            address={address}
            key='modal-change-pass'
            onClose={togglePassword}
          />
        )}
        {isTransferOpen && (
          <Modal
            className='app--accounts-Modal'
            header={t('Send assets')}
          >
            <Modal.Content>
              <Transfer
                key='modal-transfer'
                onClose={toggleTransfer}
                senderId={address}
              />
            </Modal.Content>
            {/* <Modal.Actions>
              <TxButton
                // accountId={senderId}
                // extrinsic={extrinsic}
                icon='send'
                // isDisabled={!hasAvailable}
                isPrimary
                label={t('Send')}
                onStart={onClose}
              />
            </Modal.Actions> */}
          </Modal>
        )}
        {isRecoverAccountOpen && (
          <RecoverAccount
            address={address}
            key='recover-account'
            onClose={toggleRecoverAccount}
          />
        )}
        {isRecoverSetupOpen && (
          <RecoverSetup
            address={address}
            key='recover-setup'
            onClose={toggleRecoverSetup}
          />
        )}
      </td>
      <td className='top'>
        {isEditingTags ? (
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
        ) : (
          <div className='tags--toggle' onClick={toggleEditTags}>
            {tags.length ? (
              tags.map(
                (tag): React.ReactNode => (
                  <Label key={tag} size='tiny' color='grey'>
                    {tag}
                  </Label>
                )
              )
            ) : (
              <label>{t('no tags')}</label>
            )}
          </div>
        )}
      </td>
      <td className='top'>
        <AddressInfo
          address={address}
          withBalance
          withBalanceToggle
          withExtended={false}
        />
      </td>
      <td className='mini top'>
        <LinkPolkascan
          className='ui--AddressCard-exporer-link'
          data={address}
          type='address'
          withShort
        />
      </td>
      <td className='number top'>
        <Button
          icon='paper plane'
          isPrimary
          key='send'
          label={t('Send')}
          onClick={() => toggleTransfer()}
          size='small'
          tooltip={t('Send funds to this address')}
        />
      </td>
    </tr>
  );
}

export default styled(Account)`
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
`;
