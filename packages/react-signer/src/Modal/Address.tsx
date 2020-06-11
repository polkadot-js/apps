// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueueTx } from '@polkadot/react-components/Status/types';
import { Multisig } from '@polkadot/types/interfaces';

import React, { useCallback, useEffect, useState } from 'react';
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
  onChange: (address: string | null) => void;
  requestAddress: string;
}

interface MultiState {
  isMultiCall: boolean;
  whoFilter: string[];
}

async function queryMultisig (api: ApiPromise, currentItem: QueueTx, address: string): Promise<MultiState | null> {
  const multiModule = api.tx.multisig ? 'multisig' : 'utility';

  if (currentItem.extrinsic && isFunction(api.query[multiModule].multisigs)) {
    const { threshold, who } = extractExternal(address);
    const optMulti = await api.query[multiModule].multisigs<Option<Multisig>>(address, currentItem.extrinsic.method.hash);
    const multi = optMulti.unwrapOr(null);

    if (multi) {
      return {
        isMultiCall: ((multi.approvals.length + 1) >= threshold),
        whoFilter: who.filter((w) => !multi.approvals.some((a) => a.eq(w)))
      };
    }
  }

  return null;
}

function Address ({ children, className, currentItem, onChange, requestAddress }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const { t } = useTranslation();
  const [address, setAddress] = useState<string | null>(requestAddress);
  const [multisigInfo, setMultsigInfo] = useState<MultiState | null>(null);

  useEffect((): void => {
    if (extractExternal(requestAddress).isMultisig) {
      queryMultisig(api, currentItem, requestAddress)
        .then((info) => mountedRef.current && setMultsigInfo(info))
        .catch(console.error);
    }
  }, [api, currentItem, mountedRef, requestAddress]);

  useEffect((): void => {
    onChange(address);
  }, [address, onChange]);

  const _onToggleMultiCall = useCallback(
    () => setMultsigInfo((multisigInfo) =>
      multisigInfo
        ? { ...multisigInfo, isMultiCall: !multisigInfo.isMultiCall }
        : null
    ),
    []
  );

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
      {children}
      {multisigInfo && (
        <>
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
          <Modal.Columns>
            <Modal.Column>
              <Toggle
                className='tipToggle'
                label={
                  multisigInfo.isMultiCall
                    ? t<string>('Multisig message with call (for final approval)')
                    : t<string>('Multisig approval with hash (non-final approval)')
                }
                onChange={_onToggleMultiCall}
                value={multisigInfo.isMultiCall}
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
