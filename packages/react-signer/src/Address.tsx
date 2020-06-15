// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { QueueTx } from '@polkadot/react-components/Status/types';
import { Multisig, ProxyType } from '@polkadot/types/interfaces';
import { AddressProxy } from './types';

import React, { useEffect, useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { registry } from '@polkadot/react-api';
import { InputAddress, Modal, Toggle } from '@polkadot/react-components';
import { useApi, useIsMountedRef } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';
import { isFunction } from '@polkadot/util';

import { useTranslation } from './translate';
import Password from './Password';
import { extractExternal } from './util';

interface Props {
  className?: string;
  currentItem: QueueTx;
  onChange: (address: AddressProxy) => void;
  passwordError: string | null;
  requestAddress: string;
}

interface MultiState {
  address: string;
  isMultiCall: boolean;
  who: string[];
  whoFilter: string[];
}

interface ProxyState {
  address: string;
  isProxied: boolean;
  proxies: [string, ProxyType][];
  proxiesFilter: string[];
}

function filterProxies (tx: SubmittableExtrinsic<'promise'>, proxies: [string, ProxyType][]): string[] {
  const { method, section } = registry.findMetaCall(tx.callIndex);

  return proxies
    .filter(([, proxy]): boolean => {
      switch (proxy.toString()) {
        case 'Any':
          return true;
        case 'Governance':
          return ['council', 'democracy', 'elections', 'electionsPhragmen', 'society', 'technicalCommittee', 'treasury'].includes(section);
        case 'NonTransfer':
          return !(section === 'balances' || (section === 'indices' && method === 'transfer') || (section === 'vesting' && method === 'vestedTransfer'));
        case 'Staking':
          // Call::Utility(utility::Call::batch(..)) | Call::Utility(utility::Call::as_limited_sub(..))
          return section === 'staking' || section === 'utility';
        case 'SudoBalances':
          // return Sudo(sudo::Call::sudo(ref x)) => matches!(x.as_ref(), &Call::Balances(..)), Call::Utility(utility::Call::batch(..))
          return section === 'sudo' || section === 'utility';
        default:
          return false;
      }
    })
    .map(([address]) => address);
}

async function queryForMultisig (api: ApiPromise, requestAddress: string, proxyAddress: string | null, tx?: SubmittableExtrinsic<'promise'>): Promise<MultiState | null> {
  const multiModule = api.tx.multisig ? 'multisig' : 'utility';

  if (tx && isFunction(api.query[multiModule]?.multisigs)) {
    const address = proxyAddress || requestAddress;
    const { threshold, who } = extractExternal(address);
    const hash = (proxyAddress ? api.tx.proxy.proxy(requestAddress, null, tx) : tx).method.hash;
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

async function queryForProxy (api: ApiPromise, address: string, tx: SubmittableExtrinsic<'promise'>): Promise<ProxyState | null> {
  if (isFunction(api.query.proxy?.proxies)) {
    const [_proxies] = await api.query.proxy.proxies(address);
    const { isProxied } = extractExternal(address);

    if (_proxies.length) {
      const proxies = _proxies.map(([accountId, type]): [string, ProxyType] => [accountId.toString(), type]);
      const proxiesFilter = filterProxies(tx, proxies);

      return proxiesFilter.length
        ? { address, isProxied, proxies, proxiesFilter }
        : null;
    }
  }

  return null;
}

function Address ({ currentItem, onChange, passwordError, requestAddress }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const { t } = useTranslation();
  const [multiAddress, setMultiAddress] = useState<string | null>(null);
  const [proxyAddress, setProxyAddress] = useState<string | null>(null);
  const [flags, setFlags] = useState(extractExternal(requestAddress));
  const [isMultiCall, setIsMultiCall] = useState(false);
  const [isProxyActive, setIsProxyActive] = useState(true);
  const [multiInfo, setMultInfo] = useState<MultiState | null>(null);
  const [proxyInfo, setProxyInfo] = useState<ProxyState | null>(null);
  const [signAddress, setSignAddress] = useState<string | null>(requestAddress);
  const [signPassword, setSignPassword] = useState('');

  useEffect((): void => {
    setFlags(extractExternal(signAddress));
  }, [signAddress]);

  // proxy for requestor
  useEffect((): void => {
    if (currentItem.extrinsic) {
      queryForProxy(api, requestAddress, currentItem.extrinsic)
        .then((info) => mountedRef.current && setProxyInfo(info))
        .catch(console.error);
    } else {
      setProxyInfo(null);
    }
  }, [api, currentItem, mountedRef, requestAddress]);

  useEffect((): void => {
    !proxyInfo && setProxyAddress(null);
  }, [proxyInfo]);

  // multisig
  useEffect((): void => {
    if (extractExternal(proxyAddress || requestAddress).isMultisig) {
      queryForMultisig(api, requestAddress, proxyAddress, currentItem.extrinsic)
        .then((info): void => {
          if (mountedRef.current) {
            setMultInfo(info);
            setIsMultiCall(info?.isMultiCall || false);
          }
        })
        .catch(console.error);
    } else {
      setMultInfo(null);
    }
  }, [proxyAddress, api, currentItem, mountedRef, requestAddress]);

  // address
  useEffect((): void => {
    setSignAddress(
      (multiInfo && multiAddress) ||
      (isProxyActive && proxyInfo && proxyAddress) ||
      requestAddress
    );
  }, [multiAddress, proxyAddress, isProxyActive, multiInfo, proxyInfo, requestAddress]);

  useEffect((): void => {
    onChange({
      isMultiCall: isMultiCall,
      multiRoot: multiInfo ? multiInfo.address : null,
      proxyRoot: (proxyInfo && isProxyActive) ? proxyInfo.address : null,
      signAddress,
      signPassword
    });
  }, [isProxyActive, isMultiCall, multiAddress, multiInfo, onChange, proxyAddress, proxyInfo, signAddress, signPassword]);

  return (
    <>
      <Modal.Columns>
        <Modal.Column>
          <InputAddress
            className='full'
            defaultValue={requestAddress}
            isDisabled
            isInput
            label={t('sending from my account')}
            withLabel
          />
        </Modal.Column>
        <Modal.Column>
          <p>{t('The sending account that will be used to send this transaction. Any applicable fees will be paid by this account.')}</p>
        </Modal.Column>
      </Modal.Columns>
      {proxyInfo && isProxyActive && (
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              filter={proxyInfo.proxiesFilter}
              help={t('The proxy to be used for this transaction.')}
              label={t('proxy account')}
              onChange={setProxyAddress}
              type='account'
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t('The proxy is one of the allowed proxies on the account, as set and filtered by the transaction type.')}</p>
          </Modal.Column>
        </Modal.Columns>
      )}
      {multiInfo && (
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              filter={multiInfo.whoFilter}
              help={t('The multisig signatory for this transaction.')}
              label={t('multisig signatory')}
              onChange={setMultiAddress}
              type='account'
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t('The signatory is one of the allowed accounts on the multisig, making a recorded approval for the transaction.')}</p>
          </Modal.Column>
        </Modal.Columns>
      )}
      {signAddress && !currentItem.isUnsigned && flags.isUnlockable && (
        <Password
          address={signAddress}
          error={passwordError}
          onChange={setSignPassword}
        />
      )}
      {proxyInfo && (
        <Modal.Columns>
          <Modal.Column>
            <Toggle
              className='tipToggle'
              isDisabled={proxyInfo.isProxied}
              label={
                isProxyActive
                  ? t<string>('Use a proxy for this call')
                  : t<string>("Don't use a proxy for this call")
              }
              onChange={setIsProxyActive}
              value={isProxyActive}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t('This could either be an approval for the hash or with full call details. The call as last approval triggers execution.')}</p>
          </Modal.Column>
        </Modal.Columns>
      )}
      {multiInfo && (
        <Modal.Columns>
          <Modal.Column>
            <Toggle
              className='tipToggle'
              label={
                isMultiCall
                  ? t<string>('Multisig message with call (for final approval)')
                  : t<string>('Multisig approval with hash (non-final approval)')
              }
              onChange={setIsMultiCall}
              value={isMultiCall}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t('This could either be an approval for the hash or with full call details. The call as last approval triggers execution.')}</p>
          </Modal.Column>
        </Modal.Columns>
      )}
    </>
  );
}

export default React.memo(Address);
