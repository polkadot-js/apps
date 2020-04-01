// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountInfo, DeriveBalancesAll } from '@polkadot/api-derive/types';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import { RecoveryConfig } from '@polkadot/types/interfaces';

import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { AddressInfo, AddressSmall, Badge, Button, ChainLock, CryptoType, Forget, Icon, IdentityIcon, Input, InputTags, LinkExternal, Menu, Popup, Tag } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';
import keyring from '@polkadot/ui-keyring';
import { formatBalance, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Backup from './modals/Backup';
import ChangePass from './modals/ChangePass';
import Derive from './modals/Derive';
import Identity from './modals/Identity';
import RecoverAccount from './modals/RecoverAccount';
import RecoverSetup from './modals/RecoverSetup';
import Transfer from './modals/Transfer';

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
  const balancesAll = useCall<DeriveBalancesAll>(api.api.derive.balances.all as any, [address]);
  const recoveryInfo = useCall<RecoveryConfig | null>(api.api.query.recovery?.recoverable, [address], {
    transform: (opt: Option<RecoveryConfig>): RecoveryConfig | null =>
      opt.unwrapOr(null)
  });
  const [tags, setTags] = useState<string[]>([]);
  const [accName, setAccName] = useState('');
  const [genesisHash, setGenesisHash] = useState<string | null>(null);
  const [{ isDevelopment, isEditable, isExternal }, setFlags] = useState({ isDevelopment: false, isEditable: false, isExternal: false });
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
  const [isSettingsOpen, toggleSettings] = useToggle();
  const [isTransferOpen, toggleTransfer] = useToggle();

  const _setTags = useCallback(
    (tags: string[]): void => setTags(tags.sort()),
    []
  );

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
    const account = keyring.getAccount(address);

    setGenesisHash(account?.meta.genesisHash || null);
    setFlags({
      isDevelopment: account?.meta.isTesting || false,
      isEditable: (account && !(account.meta.isInjected || account.meta.isHardware)) || false,
      isExternal: account?.meta.isExternal || false
    });
    _setTags(account?.meta.tags || []);
    setAccName(account?.meta.name || '');
  }, [address, _setTags]);

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

  const _onFavorite = useCallback(
    (): void => toggleFavorite(address),
    [address, toggleFavorite]
  );
  const _onGenesisChange = useCallback(
    (genesisHash: string | null): void => {
      const account = keyring.getPair(address);

      account && keyring.saveAccountMeta(account, { ...account.meta, genesisHash });

      setGenesisHash(genesisHash);
    },
    [address]
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
  const _onForget = useCallback(
    (): void => {
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
          className={`${isFavorite && 'isSelected isColorHighlight'}`}
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
            key='modal-forget-account'
            onClose={toggleForget}
            onForget={_onForget}
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
          <Transfer
            key='modal-transfer'
            onClose={toggleTransfer}
            senderId={address}
          />
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
      <td className='number'>
        <CryptoType accountId={address} />
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
          withBalance
          withBalanceToggle
          withExtended={false}
        />
      </td>
      <td className='button'>
        <Button
          icon='paper plane'
          label={t('send')}
          onClick={toggleTransfer}
          size='small'
          tooltip={t('Send funds from this account')}
        />
        <Popup
          className='theme--default'
          onClose={toggleSettings}
          open={isSettingsOpen}
          position='bottom right'
          trigger={
            <Button
              icon='setting'
              onClick={toggleSettings}
              size='small'
            />
          }
        >
          <Menu
            onClick={toggleSettings}
            text
            vertical
          >
            <Menu.Item
              disabled={!api.api.tx.identity?.setIdentity}
              onClick={toggleIdentity}
            >
              {t('Set on-chain identity')}
            </Menu.Item>
            <Menu.Item
              disabled={!isEditable || isExternal}
              onClick={toggleDerive}
            >
              {t('Derive account via derivation path')}
            </Menu.Item>
            <Menu.Item
              disabled={!isEditable || isExternal || isDevelopment}
              onClick={toggleBackup}
            >
              {t('Create a backup file for this account')}
            </Menu.Item>
            <Menu.Item
              disabled={!isEditable || isExternal || isDevelopment}
              onClick={togglePassword}
            >
              {t("Change this account's password")}
            </Menu.Item>
            <Menu.Item
              disabled={!isEditable || isDevelopment}
              onClick={toggleForget}
            >
              {t('Forget this account')}
            </Menu.Item>
            {api.api.tx.recovery?.createRecovery && (
              <>
                <Menu.Divider />
                {!recoveryInfo && (
                  <Menu.Item onClick={toggleRecoverSetup}>
                    {t('Make recoverable')}
                  </Menu.Item>
                )}
                <Menu.Item onClick={toggleRecoverAccount}>
                  {t('Initiate recovery for another')}
                </Menu.Item>
              </>
            )}
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

export default React.memo(styled(Account)`
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
`);
