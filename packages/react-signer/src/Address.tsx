// Copyright 2017-2025 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { QueueTx } from '@polkadot/react-components/Status/types';
import type { Option, Vec } from '@polkadot/types';
import type { AccountId, BalanceOf, Call, Multisig } from '@polkadot/types/interfaces';
import type { KitchensinkRuntimeProxyType, PalletProxyProxyDefinition } from '@polkadot/types/lookup';
import type { ITuple } from '@polkadot/types/types';
import type { BN } from '@polkadot/util';
import type { AddressFlags, AddressProxy } from './types.js';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { InputAddress, MarkError, Modal, Toggle } from '@polkadot/react-components';
import { useAccounts, useApi, useIsMountedRef } from '@polkadot/react-hooks';
import { BN_ZERO, isFunction } from '@polkadot/util';

import Password from './Password.js';
import { useTranslation } from './translate.js';
import { extractExternal } from './util.js';

interface Props {
  className?: string;
  currentItem: QueueTx;
  onChange: (address: AddressProxy) => void;
  onEnter?: () => void;
  passwordError: string | null;
  requestAddress: string | null;
}

interface MultiState {
  address: string | null;
  isMultiCall: boolean;
  who: string[];
  whoFilter: string[];
}

interface PasswordState {
  isUnlockCached: boolean;
  signPassword: string;
}

interface ProxyState {
  address: string | null;
  isProxied: boolean;
  proxies: [string, BN, KitchensinkRuntimeProxyType][];
  proxiesFilter: string[];
}

function findCall (tx: Call | SubmittableExtrinsic<'promise'>): { method: string; section: string } {
  try {
    const { method, section } = tx.registry.findMetaCall(tx.callIndex);

    return { method, section };
  } catch {
    return { method: 'unknown', section: 'unknown' };
  }
}

function filterProxies (
  allAccounts: string[],
  tx: Call | SubmittableExtrinsic<'promise'>,
  proxies: [string, BN, KitchensinkRuntimeProxyType][],
  bypassProxyTypeCheck = false
): string[] {
  // get the call info
  const { method, section } = findCall(tx);

  // check an array of calls to all have proxies as the address
  const checkCalls = (address: string, txs: Call[]): boolean =>
    !txs.some((tx) => !filterProxies(allAccounts, tx, proxies, bypassProxyTypeCheck).includes(address));

  // inspect nested calls, e.g. batch, ensuring that the proxy address
  // is applicable to the containing calls
  const checkNested = (address: string): boolean =>
    section === 'utility' && (
      (
        ['batch', 'batchAll'].includes(method) &&
        checkCalls(address, tx.args[0] as Vec<Call>)
      ) ||
      (
        ['asLimitedSub'].includes(method) &&
        checkCalls(address, [tx.args[0] as Call])
      )
    );

  return proxies
    .filter(([address, delay, proxy]): boolean => {
      // FIXME Change when we add support for delayed proxies
      if (!allAccounts.includes(address) || !delay.isZero()) {
        return false;
      } else if (bypassProxyTypeCheck) {
        return true;
      }

      switch (proxy.toString()) {
        case 'Any':
          return true;

        case 'Governance':
          return checkNested(address) || (
            ['convictionVoting', 'council', 'councilCollective', 'democracy', 'elections', 'electionsPhragmen', 'fellowshipCollective', 'fellowshipReferenda', 'phragmenElection', 'poll', 'referenda', 'society', 'technicalCommittee', 'tips', 'treasury', 'whitelist'].includes(section)
          );

        case 'IdentityJudgement':
          return checkNested(address) || (
            section === 'identity' &&
            method === 'provideJudgement'
          );

        case 'NonTransfer':
          return !(
            section === 'balances' ||
            (
              section === 'indices' &&
              method === 'transfer'
            ) ||
            (
              section === 'vesting' &&
              method === 'vestedTransfer'
            )
          );

        case 'Staking':
          return checkNested(address) || (
            ['fastUnstake', 'staking'].includes(section)
          );

        case 'SudoBalances':
          return checkNested(address) || (
            section === 'sudo' &&
            method === 'sudo' &&
            findCall(tx.args[0] as Call).section === 'balances'
          );

        default:
          // any unknown proxy types apply to all - leave it to the user to filter
          return true;
      }
    })
    .map(([address]) => address);
}

async function queryForMultisig (api: ApiPromise, requestAddress: string | null, proxyAddress: string | null, isProxyActive: boolean, tx: SubmittableExtrinsic<'promise'>): Promise<MultiState | null> {
  const multiModule = api.tx.multisig ? 'multisig' : 'utility';

  if (isFunction(api.query[multiModule]?.multisigs)) {
    const address = isProxyActive ? proxyAddress : requestAddress;
    const { threshold, who } = extractExternal(address);
    const isProxyPalletAvailable = isFunction(api.tx.proxy?.proxy);
    const hash = (address && isProxyPalletAvailable ? api.tx.proxy.proxy(requestAddress || '', null, tx) : tx).method.hash;

    const optMulti = await api.query[multiModule].multisigs<Option<Multisig>>(address, hash);
    const multi = optMulti.unwrapOr(null);

    return multi
      ? {
        address,
        isMultiCall: ((multi.approvals.length + 1) >= threshold),
        who,
        whoFilter: who.filter((w) => !multi.approvals.some((a) => a.eq(w)))
      }
      : {
        address,
        isMultiCall: false,
        who,
        whoFilter: who
      };
  }

  return null;
}

async function queryForProxy (api: ApiPromise, allAccounts: string[], address: string | null, tx: SubmittableExtrinsic<'promise'>): Promise<ProxyState | null> {
  if (isFunction(api.query.proxy?.proxies)) {
    const { isProxied } = extractExternal(address);
    const [_proxies] = await api.query.proxy.proxies<ITuple<[Vec<ITuple<[AccountId, KitchensinkRuntimeProxyType]> | PalletProxyProxyDefinition>, BalanceOf]>>(address);
    const proxies = api.tx.proxy.addProxy.meta.args.length === 3
      ? (_proxies as PalletProxyProxyDefinition[]).map(({ delay, delegate, proxyType }): [string, BN, KitchensinkRuntimeProxyType] => [delegate.toString(), delay, proxyType])
      : (_proxies as [AccountId, KitchensinkRuntimeProxyType][]).map(([delegate, proxyType]): [string, BN, KitchensinkRuntimeProxyType] => [delegate.toString(), BN_ZERO, proxyType]);
    const proxiesFilter = filterProxies(allAccounts, tx, proxies);

    if (proxiesFilter.length) {
      return { address, isProxied, proxies, proxiesFilter };
    }
  }

  return null;
}

function Address ({ currentItem, onChange, onEnter, passwordError, requestAddress }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const mountedRef = useIsMountedRef();
  const [multiAddress, setMultiAddress] = useState<string | null>(null);
  const [proxyAddress, setProxyAddress] = useState<string | null>(null);
  const [isMultiCall, setIsMultiCall] = useState(false);
  const [isProxyActive, setIsProxyActive] = useState(true);
  const [multiInfo, setMultInfo] = useState<MultiState | null>(null);
  const [proxyInfo, setProxyInfo] = useState<ProxyState | null>(null);
  const [{ isUnlockCached, signPassword }, setSignPassword] = useState<PasswordState>(() => ({ isUnlockCached: false, signPassword: '' }));

  const [signAddress, flags] = useMemo(
    (): [string | null, AddressFlags] => {
      // Always check for possibility for multisig first,
      // --- if it's multisig proxy account, it will sign with one of it's signatories
      // --- else with it's own signatories
      // if it's not a multisig, user can sign with proxy or native account
      const signAddress = (multiInfo && multiAddress) ||
        (isProxyActive && proxyInfo && proxyAddress) ||
        requestAddress;

      try {
        return [signAddress, extractExternal(signAddress)];
      } catch {
        return [signAddress, {} as AddressFlags];
      }
    },
    [multiAddress, proxyAddress, isProxyActive, multiInfo, proxyInfo, requestAddress]
  );

  const _updatePassword = useCallback(
    (signPassword: string, isUnlockCached: boolean) => setSignPassword({ isUnlockCached, signPassword }),
    []
  );

  useEffect((): void => {
    !proxyInfo && setProxyAddress(null);
  }, [proxyInfo]);

  // proxy for requestor
  useEffect((): void => {
    setProxyInfo(null);

    currentItem.extrinsic &&
      queryForProxy(api, allAccounts, requestAddress, currentItem.extrinsic)
        .then((info) => mountedRef.current && setProxyInfo(info))
        .catch(console.error);
  }, [allAccounts, api, currentItem, mountedRef, requestAddress]);

  // multisig
  useEffect((): void => {
    setMultInfo(null);

    currentItem.extrinsic && extractExternal(isProxyActive && proxyInfo ? proxyAddress : requestAddress).isMultisig &&
      queryForMultisig(api, requestAddress, proxyAddress, !!(isProxyActive && proxyInfo), currentItem.extrinsic)
        .then((info): void => {
          if (mountedRef.current) {
            setMultInfo(info);
            setIsMultiCall(info?.isMultiCall || false);
          }
        })
        .catch(console.error);
  }, [proxyAddress, api, currentItem, mountedRef, requestAddress, isProxyActive, proxyInfo]);

  useEffect((): void => {
    onChange({
      isMultiCall,
      isUnlockCached,
      multiRoot: multiInfo ? multiInfo.address : null,
      proxyRoot: (proxyInfo && isProxyActive) ? proxyInfo.address : null,
      signAddress,
      signPassword
    });
  }, [isProxyActive, isMultiCall, isUnlockCached, multiAddress, multiInfo, onChange, proxyAddress, proxyInfo, signAddress, signPassword]);

  return (
    <>
      <Modal.Columns hint={t('The sending account that will be used to send this transaction. Any applicable fees will be paid by this account.')}>
        <InputAddress
          className='full'
          defaultValue={requestAddress}
          isDisabled
          isInput
          label={t('sending from my account')}
          withLabel
        />
      </Modal.Columns>
      {proxyInfo && isProxyActive && (
        <Modal.Columns hint={t('The proxy is one of the allowed proxies on the account, as set and filtered by the transaction type.')}>
          <InputAddress
            filter={proxyInfo.proxiesFilter}
            label={t('proxy account')}
            onChange={setProxyAddress}
            type='account'
          />
        </Modal.Columns>
      )}
      {multiInfo && (
        <Modal.Columns hint={t('The signatory is one of the allowed accounts on the multisig, making a recorded approval for the transaction.')}>
          <InputAddress
            filter={multiInfo.whoFilter}
            label={t('multisig signatory')}
            onChange={setMultiAddress}
            type='account'
          />
        </Modal.Columns>
      )}
      {signAddress && !currentItem.isUnsigned && flags.isUnlockable && (
        <Password
          address={signAddress}
          error={passwordError}
          onChange={_updatePassword}
          onEnter={onEnter}
        />
      )}
      {passwordError && (
        <Modal.Columns>
          <MarkError content={passwordError} />
        </Modal.Columns>
      )}
      {proxyInfo && (
        <Modal.Columns hint={t('This could either be an approval for the hash or with full call details. The call as last approval triggers execution.')}>
          <Toggle
            className='tipToggle'
            isDisabled={proxyInfo.isProxied}
            label={
              isProxyActive
                ? t('Use a proxy for this call')
                : t("Don't use a proxy for this call")
            }
            onChange={setIsProxyActive}
            value={isProxyActive}
          />
        </Modal.Columns>
      )}
      {multiInfo && (
        <Modal.Columns hint={t('This could either be an approval for the hash or with full call details. The call as last approval triggers execution.')}>
          <Toggle
            className='tipToggle'
            label={
              isMultiCall
                ? t('Multisig message with call (for final approval)')
                : t('Multisig approval with hash (non-final approval)')
            }
            onChange={setIsMultiCall}
            value={isMultiCall}
          />
        </Modal.Columns>
      )}
    </>
  );
}

export default React.memo(Address);
