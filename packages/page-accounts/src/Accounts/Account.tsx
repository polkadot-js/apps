// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { DeriveDemocracyLock, DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { Ledger } from '@polkadot/hw-ledger';
import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { ThemeDef } from '@polkadot/react-components/types';
import type { Option } from '@polkadot/types';
import type { ProxyDefinition, RecoveryConfig } from '@polkadot/types/interfaces';
import type { KeyringAddress, KeyringJson$Meta } from '@polkadot/ui-keyring/types';
import type { AccountBalance, Delegation } from '../types';

import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';

import { ApiPromise } from '@polkadot/api';
import { AddressInfo, AddressSmall, Badge, Button, ChainLock, CryptoType, ExpandButton, Forget, Icon, LinkExternal, Menu, Popup, StatusContext, Tags } from '@polkadot/react-components';
import { useAccountInfo, useApi, useBalancesAll, useBestNumber, useCall, useLedger, useStakingInfo, useToggle } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { BN, BN_ZERO, formatBalance, formatNumber, isFunction } from '@polkadot/util';

import Backup from '../modals/Backup';
import ChangePass from '../modals/ChangePass';
import DelegateModal from '../modals/Delegate';
import Derive from '../modals/Derive';
import IdentityMain from '../modals/IdentityMain';
import IdentitySub from '../modals/IdentitySub';
import MultisigApprove from '../modals/MultisigApprove';
import ProxyOverview from '../modals/ProxyOverview';
import RecoverAccount from '../modals/RecoverAccount';
import RecoverSetup from '../modals/RecoverSetup';
import Transfer from '../modals/Transfer';
import UndelegateModal from '../modals/Undelegate';
import { useTranslation } from '../translate';
import { createMenuGroup } from '../util';
import useMultisigApprovals from './useMultisigApprovals';
import useProxies from './useProxies';

interface Props {
  account: KeyringAddress;
  className?: string;
  delegation?: Delegation;
  filter: string;
  isFavorite: boolean;
  proxy?: [ProxyDefinition[], BN];
  setBalance: (address: string, value: AccountBalance) => void;
  toggleFavorite: (address: string) => void;
}

interface DemocracyUnlockable {
  democracyUnlockTx: SubmittableExtrinsic<'promise'> | null;
  ids: BN[];
}

function calcVisible (filter: string, name: string, tags: string[]): boolean {
  if (filter.length === 0) {
    return true;
  }

  const _filter = filter.toLowerCase();

  return tags.reduce((result: boolean, tag: string): boolean => {
    return result || tag.toLowerCase().includes(_filter);
  }, name.toLowerCase().includes(_filter));
}

function calcUnbonding (stakingInfo?: DeriveStakingAccount) {
  if (!stakingInfo?.unlocking) {
    return BN_ZERO;
  }

  const filtered = stakingInfo.unlocking
    .filter(({ remainingEras, value }) => value.gt(BN_ZERO) && remainingEras.gt(BN_ZERO))
    .map((unlock) => unlock.value);
  const total = filtered.reduce((total, value) => total.iadd(value), new BN(0));

  return total;
}

function createClearDemocracyTx (api: ApiPromise, address: string, unlockableIds: BN[]): SubmittableExtrinsic<'promise'> | null {
  return api.tx.utility
    ? api.tx.utility.batch(
      unlockableIds
        .map((id) => api.tx.democracy.removeVote(id))
        .concat(api.tx.democracy.unlock(address))
    )
    : null;
}

async function showLedgerAddress (getLedger: () => Ledger, meta: KeyringJson$Meta): Promise<void> {
  const ledger = getLedger();

  await ledger.getAddress(true, meta.accountOffset as number || 0, meta.addressOffset as number || 0);
}

const transformRecovery = {
  transform: (opt: Option<RecoveryConfig>) => opt.unwrapOr(null)
};

function Account ({ account: { address, meta }, className = '', delegation, filter, isFavorite, proxy, setBalance, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [isExpanded, toggleIsExpanded] = useToggle(false);
  const { theme } = useContext(ThemeContext as React.Context<ThemeDef>);
  const { queueExtrinsic } = useContext(StatusContext);
  const api = useApi();
  const { getLedger } = useLedger();
  const bestNumber = useBestNumber();
  const balancesAll = useBalancesAll(address);
  const stakingInfo = useStakingInfo(address);
  const democracyLocks = useCall<DeriveDemocracyLock[]>(api.api.derive.democracy?.locks, [address]);
  const recoveryInfo = useCall<RecoveryConfig | null>(api.api.query.recovery?.recoverable, [address], transformRecovery);
  const multiInfos = useMultisigApprovals(address);
  const proxyInfo = useProxies(address);
  const { flags: { isDevelopment, isEditable, isEthereum, isExternal, isHardware, isInjected, isMultisig, isProxied }, genesisHash, identity, name: accName, onSetGenesisHash, tags } = useAccountInfo(address);
  const [{ democracyUnlockTx }, setUnlockableIds] = useState<DemocracyUnlockable>({ democracyUnlockTx: null, ids: [] });
  const [vestingVestTx, setVestingTx] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [isBackupOpen, toggleBackup] = useToggle();
  const [isDeriveOpen, toggleDerive] = useToggle();
  const [isForgetOpen, toggleForget] = useToggle();
  const [isIdentityMainOpen, toggleIdentityMain] = useToggle();
  const [isIdentitySubOpen, toggleIdentitySub] = useToggle();
  const [isMultisigOpen, toggleMultisig] = useToggle();
  const [isProxyOverviewOpen, toggleProxyOverview] = useToggle();
  const [isPasswordOpen, togglePassword] = useToggle();
  const [isRecoverAccountOpen, toggleRecoverAccount] = useToggle();
  const [isRecoverSetupOpen, toggleRecoverSetup] = useToggle();
  const [isTransferOpen, toggleTransfer] = useToggle();
  const [isDelegateOpen, toggleDelegate] = useToggle();
  const [isUndelegateOpen, toggleUndelegate] = useToggle();

  useEffect((): void => {
    if (balancesAll) {
      setBalance(address, {
        bonded: stakingInfo?.stakingLedger.active.unwrap() ?? BN_ZERO,
        locked: balancesAll.lockedBalance,
        redeemable: stakingInfo?.redeemable ?? BN_ZERO,
        total: balancesAll.freeBalance.add(balancesAll.reservedBalance),
        transferrable: balancesAll.availableBalance,
        unbonding: calcUnbonding(stakingInfo)
      });

      api.api.tx.vesting?.vest && setVestingTx(() =>
        balancesAll.vestingLocked.isZero()
          ? null
          : api.api.tx.vesting.vest()
      );
    }
  }, [address, api, balancesAll, setBalance, stakingInfo]);

  useEffect((): void => {
    bestNumber && democracyLocks && setUnlockableIds(
      (prev): DemocracyUnlockable => {
        const ids = democracyLocks
          .filter(({ isFinished, unlockAt }) => isFinished && bestNumber.gt(unlockAt))
          .map(({ referendumId }) => referendumId);

        if (JSON.stringify(prev.ids) === JSON.stringify(ids)) {
          return prev;
        }

        return {
          democracyUnlockTx: createClearDemocracyTx(api.api, address, ids),
          ids
        };
      }
    );
  }, [address, api, bestNumber, democracyLocks]);

  const isVisible = useMemo(
    () => calcVisible(filter, accName, tags),
    [accName, filter, tags]
  );

  const _onFavorite = useCallback(
    () => toggleFavorite(address),
    [address, toggleFavorite]
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
        status.message = t<string>('account forgotten');
      } catch (error) {
        status.status = 'error';
        status.message = (error as Error).message;
      }
    },
    [address, t]
  );

  const _clearDemocracyLocks = useCallback(
    () => democracyUnlockTx && queueExtrinsic({
      accountId: address,
      extrinsic: democracyUnlockTx
    }),
    [address, democracyUnlockTx, queueExtrinsic]
  );

  const _vestingVest = useCallback(
    () => vestingVestTx && queueExtrinsic({
      accountId: address,
      extrinsic: vestingVestTx
    }),
    [address, queueExtrinsic, vestingVestTx]
  );

  const _showOnHardware = useCallback(
    // TODO: we should check the hardwareType from metadata here as well,
    // for now we are always assuming hardwareType === 'ledger'
    (): void => {
      showLedgerAddress(getLedger, meta).catch((error): void => {
        console.error(`ledger: ${(error as Error).message}`);
      });
    },
    [getLedger, meta]
  );

  const menuItems = useMemo(() => [
    createMenuGroup('identityGroup', [
      isFunction(api.api.tx.identity?.setIdentity) && !isHardware && (
        <Menu.Item
          icon='link'
          key='identityMain'
          onClick={toggleIdentityMain}
        >
          {t('Set on-chain identity')}
        </Menu.Item>
      ),
      isFunction(api.api.tx.identity?.setSubs) && identity?.display && !isHardware && (
        <Menu.Item
          icon='vector-square'
          key='identitySub'
          onClick={toggleIdentitySub}
        >
          {t('Set on-chain sub-identities')}
        </Menu.Item>
      ),
      isFunction(api.api.tx.democracy?.unlock) && democracyUnlockTx && (
        <Menu.Item
          icon='broom'
          key='clearDemocracy'
          onClick={_clearDemocracyLocks}
        >
          {t('Clear expired democracy locks')}
        </Menu.Item>
      ),
      isFunction(api.api.tx.vesting?.vest) && vestingVestTx && (
        <Menu.Item
          icon='unlock'
          key='vestingVest'
          onClick={_vestingVest}
        >
          {t('Unlock vested amount')}
        </Menu.Item>
      )
    ], t('Identity')),
    createMenuGroup('deriveGroup', [
      !(isEthereum || isExternal || isHardware || isInjected || isMultisig || api.isEthereum) && (
        <Menu.Item
          icon='download'
          key='deriveAccount'
          onClick={toggleDerive}
        >
          {t('Derive account via derivation path')}
        </Menu.Item>
      ),
      isHardware && (
        <Menu.Item
          icon='eye'
          key='showHwAddress'
          onClick={_showOnHardware}
        >
          {t('Show address on hardware device')}
        </Menu.Item>
      )
    ], t('Derive')),
    createMenuGroup('backupGroup', [
      !(isExternal || isHardware || isInjected || isMultisig || isDevelopment) && (
        <Menu.Item
          icon='database'
          key='backupJson'
          onClick={toggleBackup}
        >
          {t('Create a backup file for this account')}
        </Menu.Item>
      ),
      !(isExternal || isHardware || isInjected || isMultisig || isDevelopment) && (
        <Menu.Item
          icon='edit'
          key='changePassword'
          onClick={togglePassword}
        >
          {t("Change this account's password")}
        </Menu.Item>
      ),
      !(isInjected || isDevelopment) && (
        <Menu.Item
          icon='trash-alt'
          key='forgetAccount'
          onClick={toggleForget}
        >
          {t('Forget this account')}
        </Menu.Item>
      )
    ], t('Backup')),
    isFunction(api.api.tx.recovery?.createRecovery) && createMenuGroup('reoveryGroup', [
      !recoveryInfo && (
        <Menu.Item
          icon='redo'
          key='makeRecoverable'
          onClick={toggleRecoverSetup}
        >
          {t('Make recoverable')}
        </Menu.Item>
      ),
      <Menu.Item
        icon='screwdriver'
        key='initRecovery'
        onClick={toggleRecoverAccount}
      >
        {t('Initiate recovery for another')}
      </Menu.Item>
    ], t('Recovery')),
    isFunction(api.api.tx.multisig?.asMulti) && isMultisig && createMenuGroup('multisigGroup', [
      <Menu.Item
        icon='file-signature'
        isDisabled={!multiInfos || !multiInfos.length}
        key='multisigApprovals'
        onClick={toggleMultisig}
      >
        {t('Multisig approvals')}
      </Menu.Item>
    ], t('Multisig')),
    isFunction(api.api.query.democracy?.votingOf) && delegation?.accountDelegated && createMenuGroup('undelegateGroup', [
      <Menu.Item
        icon='user-edit'
        key='changeDelegate'
        onClick={toggleDelegate}
      >
        {t('Change democracy delegation')}
      </Menu.Item>,
      <Menu.Item
        icon='user-minus'
        key='undelegate'
        onClick={toggleUndelegate}
      >
        {t('Undelegate')}
      </Menu.Item>
    ], t('Undelegate')),
    createMenuGroup('delegateGroup', [
      isFunction(api.api.query.democracy?.votingOf) && !delegation?.accountDelegated && (
        <Menu.Item
          icon='user-plus'
          key='delegate'
          onClick={toggleDelegate}
        >

          {t('Delegate democracy votes')}
        </Menu.Item>
      ),
      isFunction(api.api.query.proxy?.proxies) && (
        <Menu.Item
          icon='sitemap'
          key='proxy-overview'
          onClick={toggleProxyOverview}
        >
          {proxy?.[0].length
            ? t('Manage proxies')
            : t('Add proxy')
          }
        </Menu.Item>
      )
    ], t('Delegate')),
    isEditable && !api.isDevelopment && createMenuGroup('genesisGroup', [
      <ChainLock
        className='accounts--network-toggle'
        genesisHash={genesisHash}
        key='chainlock'
        onChange={onSetGenesisHash}
      />
    ])
  ].filter((i) => i),
  [_clearDemocracyLocks, _showOnHardware, _vestingVest, api, delegation, democracyUnlockTx, genesisHash, identity, isDevelopment, isEditable, isEthereum, isExternal, isHardware, isInjected, isMultisig, multiInfos, onSetGenesisHash, proxy, recoveryInfo, t, toggleBackup, toggleDelegate, toggleDerive, toggleForget, toggleIdentityMain, toggleIdentitySub, toggleMultisig, togglePassword, toggleProxyOverview, toggleRecoverAccount, toggleRecoverSetup, toggleUndelegate, vestingVestTx]);

  if (!isVisible) {
    return null;
  }

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
        <td className='together'>
          <div className='badges'>
            <div className='info'>
              {meta.genesisHash
                ? <Badge color='transparent' />
                : isDevelopment
                  ? (
                    <Badge
                      className='warning'
                      hover={t<string>('This is a development account derived from the known development seed. Do not use for any funds on a non-development network.')}
                      icon='wrench'
                    />
                  )
                  : (
                    <Badge
                      className='warning'
                      hover={
                        <div>
                          <p>{t<string>('This account is available on all networks. It is recommended to link to a specific network via the account options ("only this network" option) to limit availability. For accounts from an extension, set the network on the extension.')}</p>
                          <p>{t<string>('This does not send any transaction, rather it only sets the genesis in the account JSON.')}</p>
                        </div>
                      }
                      icon='exclamation-triangle'
                    />
                  )
              }
              {recoveryInfo && (
                <Badge
                  className='recovery'
                  hover={
                    <div>
                      <p>{t<string>('This account is recoverable, with the following friends:')}</p>
                      <div>
                        {recoveryInfo.friends.map((friend, index): React.ReactNode => (
                          <AddressSmall
                            key={index}
                            value={friend}
                          />
                        ))}
                      </div>
                      <table>
                        <tbody>
                          <tr>
                            <td>{t<string>('threshold')}</td>
                            <td>{formatNumber(recoveryInfo.threshold)}</td>
                          </tr>
                          <tr>
                            <td>{t<string>('delay')}</td>
                            <td>{formatNumber(recoveryInfo.delayPeriod)}</td>
                          </tr>
                          <tr>
                            <td>{t<string>('deposit')}</td>
                            <td>{formatBalance(recoveryInfo.deposit)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  }
                  icon='redo'
                />
              )}
              {isProxied && !proxyInfo.hasOwned && (
                <Badge
                  className='important'
                  hover={t<string>('Proxied account has no owned proxies')}
                  icon='sitemap'
                  info='0'
                />
              )}
            </div>
            <div className='action'>
              {multiInfos && multiInfos.length !== 0 && (
                <Badge
                  className='important'
                  color='purple'
                  hover={t<string>('Multisig approvals pending')}
                  hoverAction={t<string>('View pending approvals')}
                  icon='file-signature'
                  info={multiInfos.length}
                  onClick={toggleMultisig}
                />
              )}
              {delegation?.accountDelegated && (
                <Badge
                  className='information'
                  hover={t<string>('This account has a governance delegation')}
                  hoverAction={t<string>('Manage delegation')}
                  icon='calendar-check'
                  onClick={toggleDelegate}
                />
              )}
              {!!proxy?.[0].length && api.api.tx.utility && (
                <Badge
                  className='information'
                  hover={t<string>('This account has {{proxyNumber}} proxy set.', {
                    replace: {
                      proxyNumber: proxy[0].length
                    }
                  })}
                  hoverAction={t<string>('Proxy overview')}
                  icon='sitemap'
                  onClick={toggleProxyOverview}
                />
              )}
            </div>
          </div>
        </td>
        <td className='address'>
          <AddressSmall
            parentAddress={meta.parentAddress}
            value={address}
            withShortAddress
          />
          {isBackupOpen && (
            <Backup
              address={address}
              key='modal-backup-account'
              onClose={toggleBackup}
            />
          )}
          {isDelegateOpen && (
            <DelegateModal
              key='modal-delegate'
              onClose={toggleDelegate}
              previousAmount={delegation?.amount}
              previousConviction={delegation?.conviction}
              previousDelegatedAccount={delegation?.accountDelegated}
              previousDelegatingAccount={address}
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
          {isIdentityMainOpen && (
            <IdentityMain
              address={address}
              key='modal-identity-main'
              onClose={toggleIdentityMain}
            />
          )}
          {isIdentitySubOpen && (
            <IdentitySub
              address={address}
              key='modal-identity-sub'
              onClose={toggleIdentitySub}
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
          {isProxyOverviewOpen && (
            <ProxyOverview
              key='modal-proxy-overview'
              onClose={toggleProxyOverview}
              previousProxy={proxy}
              proxiedAccount={address}
            />
          )}
          {isMultisigOpen && multiInfos && (
            <MultisigApprove
              address={address}
              key='multisig-approve'
              onClose={toggleMultisig}
              ongoing={multiInfos}
              threshold={meta.threshold as number}
              who={meta.who as string[]}
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
          {isUndelegateOpen && (
            <UndelegateModal
              accountDelegating={address}
              key='modal-delegate'
              onClose={toggleUndelegate}
            />
          )}
        </td>
        <td className='number'>
          <CryptoType accountId={address} />
        </td>
        <td className='number media--1500'>
          {balancesAll?.accountNonce.gt(BN_ZERO) && formatNumber(balancesAll.accountNonce)}
        </td>
        <td className='number'>
          <AddressInfo
            address={address}
            balancesAll={balancesAll}
            withBalance={{
              available: false,
              bonded: false,
              locked: false,
              redeemable: false,
              reserved: false,
              total: true,
              unlocking: false,
              vested: false
            }}
            withExtended={false}
          />
        </td>
        <td className='fast-actions'>
          <div className='fast-actions-row'>
            <LinkExternal
              className='ui--AddressCard-exporer-link media--1400'
              data={address}
              isLogo
              type='address'
            />
            {isFunction(api.api.tx.balances?.transfer) && (
              <Button
                className='send-button'
                icon='paper-plane'
                label={t<string>('send')}
                onClick={toggleTransfer}
              />
            )}
            <Popup
              className={`theme--${theme}`}
              isDisabled={!menuItems.length}
              value={
                <Menu>
                  {menuItems}
                </Menu>
              }
            />
            <ExpandButton
              expanded={isExpanded}
              onClick={toggleIsExpanded}
            />
          </div>
        </td>
      </tr>
      <tr className={`${className} ${isExpanded ? 'isExpanded' : 'isCollapsed'}`}>
        <td colSpan={2} />
        <td>
          <div
            className='tags'
            data-testid='tags'
          >
            <Tags
              value={tags}
              withTitle
            />
          </div>
        </td>
        <td className='media--1500' />
        <td />
        <td>
          <AddressInfo
            address={address}
            balancesAll={balancesAll}
            withBalance={{
              available: true,
              bonded: true,
              locked: true,
              redeemable: true,
              reserved: true,
              total: false,
              unlocking: true,
              vested: true
            }}
            withExtended={false}
          />
        </td>
        <td colSpan={2} />
      </tr>
    </>
  );
}

export default React.memo(styled(Account)`
  &.isCollapsed {
    visibility: collapse;
  }

  &.isExpanded {
    visibility: visible;
  }

  .tags {
    width: 100%;
    min-height: 1.5rem;
  }

  .devBadge {
    opacity: 0.65;
  }

  && td.button {
    padding-bottom: 0.5rem;
  }

  && td.fast-actions {
    padding-left: 0.2rem;
    padding-right: 1rem;
    width: 1%;

    .fast-actions-row {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      & > * + * {
        margin-left: 0.35rem;
      }

      .send-button {
        min-width: 6.5rem;
      }
    }
  }

  && .ui--AddressInfo .ui--FormatBalance,
  && .ui--AddressInfo .result {
    .ui--Icon, .icon-void {
      margin-left: 0.7rem;
      margin-right: 0.3rem;
    }

    .ui--Button.isIcon {
      margin-left: 0.5rem;
      padding: 0.15rem 0.2rem 0.05rem;
      border: 1px solid var(--border-table);
      border-radius: 4px;

      .ui--Icon {
        padding: 0;
        margin: 0;
      }
    }
  }

  .together > .badges {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    & > .info + .action {
      margin-top: 0.5rem;

      &:empty {
        margin-top: 0;
      }
    }

    & > .info:empty + .action {
      margin-top: 0;
    }
  }
`);
