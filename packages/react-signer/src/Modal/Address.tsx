// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueueTx } from '@polkadot/react-components/Status/types';
import { Multisig, ProxyType } from '@polkadot/types/interfaces';
import { AddressProxy } from './types';

import React, { useEffect, useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { InputAddress, Modal, Toggle } from '@polkadot/react-components';
import { useApi, useIsMountedRef } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';
import { isFunction } from '@polkadot/util';

import { useTranslation } from '../translate';
import { extractExternal } from './util';

interface Props {
  children: React.ReactNode;
  className?: string;
  currentItem: QueueTx;
  onChange: (address: AddressProxy) => void;
  requestAddress: string;
}

interface MultiState {
  isMultiCall: boolean;
  who: string[];
  whoFilter: string[];
}

interface ProxyState {
  proxies: [string, ProxyType][] | null;
  proxiesFilter: string[] | null;
}

async function queryForMultisig (api: ApiPromise, currentItem: QueueTx, address: string): Promise<MultiState> {
  const multiModule = api.tx.multisig ? 'multisig' : 'utility';
  const { threshold, who } = extractExternal(address);

  if (currentItem.extrinsic && isFunction(api.query[multiModule]?.multisigs)) {
    const optMulti = await api.query[multiModule].multisigs<Option<Multisig>>(address, currentItem.extrinsic.method.hash);
    const multi = optMulti.unwrapOr(null);

    if (multi) {
      return {
        isMultiCall: ((multi.approvals.length + 1) >= threshold),
        who,
        whoFilter: who.filter((w) => !multi.approvals.some((a) => a.eq(w)))
      };
    }
  }

  return { isMultiCall: false, who, whoFilter: who };
}

async function queryForProxy (api: ApiPromise, address: string): Promise<ProxyState | null> {
  if (isFunction(api.query.proxy?.proxies)) {
    const [_proxies] = await api.query.proxy.proxies(address);

    if (_proxies.length) {
      const proxies = _proxies.map(([accountId, type]): [string, ProxyType] => [accountId.toString(), type]);
      const proxiesFilter: string[] = proxies.map(([proxy]) => proxy);

      return { proxies, proxiesFilter };
    }
  }

  return null;
}

function Address ({ children, className, currentItem, onChange, requestAddress }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const { t } = useTranslation();
  const [address, setAddress] = useState<string | null>(requestAddress);
  const [isMultiCall, setIsMultiCall] = useState(false);
  const [multisigInfo, setMultsigInfo] = useState<MultiState | null>(null);
  const [, setProxyInfo] = useState<ProxyState | null>(null);

  useEffect((): void => {
    const { isMultisig, who } = extractExternal(requestAddress);

    if (isMultisig) {
      setMultsigInfo({ isMultiCall: false, who, whoFilter: who });

      queryForMultisig(api, currentItem, requestAddress)
        .then((info): void => {
          if (mountedRef.current) {
            setMultsigInfo(info);
            setIsMultiCall(info?.isMultiCall || false);
          }
        })
        .catch(console.error);
    } else {
      setMultsigInfo(null);
    }

    queryForProxy(api, requestAddress)
      .then((info) => mountedRef.current && setProxyInfo(info))
      .catch(console.error);
  }, [api, currentItem, mountedRef, requestAddress]);

  useEffect((): void => {
    onChange({
      address,
      isMultiAddress: !!multisigInfo,
      isMultiCall: isMultiCall,
      isProxyAddress: false
    });
  }, [address, isMultiCall, multisigInfo, onChange]);

  return (
    <>
      <Modal.Columns className={className}>
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
      {multisigInfo && (
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              filter={multisigInfo.whoFilter}
              help={t<string>('The multisig signatory for this transaction.')}
              label={t<string>('signatory')}
              onChange={setAddress}
              type='account'
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The signatory is one of the allowed accounts on the multisig, making a recorded approval for the transaction.')}</p>
          </Modal.Column>
        </Modal.Columns>
      )}
      {children}
      {multisigInfo && (
        <>
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
              <p>{t<string>('This could either be an approval for the hash or with full call details. The call as last approval triggers execution.')}</p>
            </Modal.Column>
          </Modal.Columns>
        </>
      )}
    </>
  );
}

export default React.memo(Address);
