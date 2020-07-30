// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { AccountId, ProxyType } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { registry } from '@polkadot/react-api';
import { Button, InputAddress, Modal, TxButton, Dropdown } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';
import styled from 'styled-components';

interface Props {
  className?: string;
  onClose: () => void;
  previousProxy?: [[AccountId, ProxyType][], BN];
  proxiedAccount: string;
}

function createExtrinsic (api: ApiPromise, batchPrevious: SubmittableExtrinsic<'promise'>[], batchAdded: SubmittableExtrinsic<'promise'>[]): SubmittableExtrinsic<'promise'> | null {
  if (batchPrevious.length + batchAdded.length === 1) {
    return batchPrevious.length
      ? batchPrevious[0]
      : batchAdded[0];
  }

  return api.tx.utility.batch([...batchPrevious, ...batchAdded]);
}

function ProxyOverview ({ className, onClose, previousProxy, proxiedAccount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  // the stack of extrinsics on the previous proxies
  const [batchStackPrevious, setBatchStackPrevious] = useState<SubmittableExtrinsic<'promise'>[]>([]);
  // the stack of extrinsics on newly added proxies
  const [batchStackAdded, setBatchStackAdded] = useState<SubmittableExtrinsic<'promise'>[]>([]);
  // the final extrinsic (either single or a batch)
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  // list of previous accounts and proxy types
  const [previousProxyAccountsTypes] = previousProxy || [];
  // actualized list of previous proxy including new changes (deletion if any)
  const [previousProxyDisplay, setPreviousProxyDisplay] = useState<[AccountId, ProxyType][] | undefined>(previousProxyAccountsTypes);
  // actualized list of new proxies (additions, if any)
  const [addedProxies, setAddedProxies] = useState<[AccountId, ProxyType][]>([]);

  useEffect(() => {
    if (batchStackPrevious.length || batchStackAdded.length) {
      setExtrinsic(createExtrinsic(api, batchStackPrevious, batchStackAdded));
    }
  }, [api, batchStackPrevious, batchStackAdded]);

  const typeOpts = useMemo(
    () => registry.createType('ProxyType').defKeys.map((text, value) => ({ text, value })),
    []
  );

  const _addProxy = useCallback(
    () => {
      const newAccount = registry.createType('AccountId', proxiedAccount);
      const newType = registry.createType('ProxyType', 0);

      setAddedProxies((prevState) => {
        const newProxy: [AccountId, ProxyType] = [newAccount, newType];

        if (!prevState) {
          return [newProxy];
        }

        const newState: [AccountId, ProxyType][] = [...prevState, newProxy];

        return newState;
      });

      setBatchStackAdded((prev) => {
        const newState = prev.concat(
          api.tx.proxy.addProxy(newAccount, newType)
        );

        return newState;
      });
    },
    [api, proxiedAccount]
  );

  const _delProxy = useCallback(
    (index: number) => () => {
      setAddedProxies((addedProxies) => addedProxies.filter((_, i) => i !== index));
      setBatchStackAdded((batchStackAdded) => batchStackAdded.filter((_, i) => i !== index));
    },
    []
  );

  const _changeAddedProxyAccount = useCallback(
    (index: number) => (address: string | null) => {
      const accountId = registry.createType('AccountId', address);
      const oldType = addedProxies[index][1];

      // update the UI with the new selected account
      setAddedProxies((prevState) => {
        const newState = [...prevState];

        newState[index][0] = accountId;

        return newState;
      });

      // Then add the new extrinsic to the batch stack with the new account
      setBatchStackAdded((batchStackAdded): SubmittableExtrinsic<'promise'>[] => {
        const newBatchAdded = batchStackAdded.filter((_, i) => i !== index);

        newBatchAdded.push(api.tx.proxy.addProxy(accountId, oldType));

        return newBatchAdded;
      });
    },
    [addedProxies, api]
  );

  const _changeAddedProxyType = useCallback(
    (index: number) => (newTypeNumber: number | undefined) => {
      const newType = registry.createType('ProxyType', newTypeNumber);
      const oldAccount = addedProxies[index][0];

      // update the UI with the new selected type
      setAddedProxies((prevState) => {
        const newState = [...prevState];

        newState[index][1] = newType;

        return newState;
      });

      // The Batch stack needs to be updated wit the new type
      // First, delete the corresponding exrrinsic in the batch stack
      const newBatchStackAdded = batchStackAdded.filter((_, i) => {
        return i !== index;
      });

      // Then add the new extrinsic to the batch stack with the new account
      newBatchStackAdded.push(api.tx.proxy.addProxy(oldAccount, newType));
      setBatchStackAdded(newBatchStackAdded);
    },
    [addedProxies, api, batchStackAdded]
  );

  return (
    <Modal
      className={className}
      header={t<string>('Proxy overview')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              isDisabled={true}
              label={t<string>('proxied account')}
              type='account'
              value={proxiedAccount}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('Any account set as proxy will be able to perform actions in place of the proxied account')}</p>
            <p>{t<string>('If you add several proxy accounts for the same proxy type (e.g 2 accounts set as proxy for Governance), then any of those 2 accounts will be able to perfom governance actions on behalf of the proxied account')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            {!!previousProxyDisplay?.length && previousProxyDisplay.map(([account, type], index) => {
              return (
                <div
                  className='proxy-container'
                  key={`previousPoxy-${index}`}
                >
                  <div className='input-column'>
                    <InputAddress
                      isDisabled={true}
                      key={`account-${index}`}
                      label={t<string>('proxy account')}
                      type='account'
                      value={account.toString()}
                    />
                    <Dropdown
                      help={'Type of proxy'}
                      isDisabled={true}
                      label={'type'}
                      options={typeOpts}
                      value={type.toNumber()}
                    />
                  </div>
                  <div className='buttons-column'>
                    <Button
                      icon='times'
                      onClick={() => {
                        setPreviousProxyDisplay(previousProxyDisplay.filter((_, i) => i !== index));
                        const newBatch = [...batchStackPrevious, api.tx.proxy.removeProxy(account, type)];

                        setBatchStackPrevious(newBatch);
                      }}
                    />
                  </div>
                </div>
              );
            })}
            {!!addedProxies?.length && addedProxies.map(([account, type], index) => {
              return (
                <div
                  className='proxy-container'
                  key={`addedProxy-${index}`}
                >
                  <div className='input-column'>
                    <InputAddress
                      label={t<string>('proxy account')}
                      onChange={_changeAddedProxyAccount(index)}
                      type='account'
                      value={account.toString()}
                    />
                    <Dropdown
                      help={'Type of proxy'}
                      label={'type'}
                      onChange={_changeAddedProxyType(index)}
                      options={typeOpts}
                      value={type.toNumber()}
                    />
                  </div>
                  <div className='buttons-column'>
                    <Button
                      icon='times'
                      onClick={_delProxy(index)}
                    />
                  </div>
                </div>);
            })}
            <div className='buttons-add-container'>
              <Button
                className='add-proxy-button'
                icon='plus'
                onClick={_addProxy}
              />
            </div>
          </Modal.Column>
          <Modal.Column>
            <p>{t('')}</p>
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={proxiedAccount}
          icon='trash-alt'
          label={t<string>('Remove all proxies')}
          onStart={onClose}
          params={[]}
          tx='proxy.removeProxies'
        />
        <TxButton
          accountId={proxiedAccount}
          extrinsic={extrinsic}
          icon='sign-in-alt'
          isDisabled={!batchStackPrevious.length && !batchStackAdded.length}
          label={t<string>('Save')}
          onStart={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(ProxyOverview)`
  .proxy-container{
    display: grid;
    grid-column-gap: 0.5rem;
    grid-template-columns: 1fr auto;
    margin-bottom: 1rem;

    .input-column{
      grid-column: 1;
    }
    .buttons-column{
      grid-column: 2;
      padding-top: 0.3rem;
    }
  }

  .add-proxy-button{
    width: 100%;
  }
`);
