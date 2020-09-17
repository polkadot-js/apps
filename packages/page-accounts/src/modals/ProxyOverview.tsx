// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { AccountId, ProxyDefinition, ProxyType } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { registry } from '@polkadot/react-api';
import { Button, InputAddress, Modal, TxButton, Dropdown } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import styled from 'styled-components';

type PrevProxy = [AccountId, ProxyType];

interface Props {
  className?: string;
  onClose: () => void;
  previousProxy?: [ProxyDefinition[], BN];
  proxiedAccount: string;
}

interface ValueProps {
  index: number;
  typeOpts: { text: string; value: number }[];
  value: PrevProxy;
}

interface NewProxyProps extends ValueProps {
  onChangeAccount: (index: number, value: string | null) => void;
  onChangeType: (index: number, value: number | undefined) => void;
  onRemove: (index: number) => void;
}

interface PrevProxyProps extends ValueProps {
  onRemove: (accountId: AccountId, type: ProxyType, index: number) => void;
}

function createExtrinsic (api: ApiPromise, batchPrevious: SubmittableExtrinsic<'promise'>[], batchAdded: SubmittableExtrinsic<'promise'>[]): SubmittableExtrinsic<'promise'> | null {
  if (batchPrevious.length + batchAdded.length === 1) {
    return batchPrevious.length
      ? batchPrevious[0]
      : batchAdded[0];
  }

  return api.tx.utility.batch([...batchPrevious, ...batchAdded]);
}

function createAddProxy (api: ApiPromise, account: AccountId, type: ProxyType, delay = 0): SubmittableExtrinsic<'promise'> {
  return api.tx.proxy.addProxy.meta.args.length === 2
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore old version
    ? api.tx.proxy.addProxy(account, type)
    : api.tx.proxy.addProxy(account, type, delay);
}

function createRmProxy (api: ApiPromise, account: AccountId, type: ProxyType, delay = 0): SubmittableExtrinsic<'promise'> {
  return api.tx.proxy.removeProxy.meta.args.length === 2
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore old version
    ? api.tx.proxy.removeProxy(account, type)
    : api.tx.proxy.removeProxy(account, type, delay);
}

function PrevProxy ({ index, onRemove, typeOpts, value: [accountId, type] }: PrevProxyProps): React.ReactElement<PrevProxyProps> {
  const { t } = useTranslation();

  const _onRemove = useCallback(
    () => onRemove(accountId, type, index),
    [accountId, index, onRemove, type]
  );

  return (
    <div className='proxy-container'>
      <div className='input-column'>
        <InputAddress
          defaultValue={accountId}
          isDisabled
          label={t<string>('proxy account')}
        />
        <Dropdown
          help={'Type of proxy'}
          isDisabled
          label={'type'}
          options={typeOpts}
          value={type.toNumber()}
        />
      </div>
      <div className='buttons-column'>
        <Button
          icon='times'
          onClick={_onRemove}
        />
      </div>
    </div>
  );
}

function NewProxy ({ index, onChangeAccount, onChangeType, onRemove, typeOpts, value: [accountId, type] }: NewProxyProps): React.ReactElement<NewProxyProps> {
  const { t } = useTranslation();

  const _onChangeAccount = useCallback(
    (value: string | null) => onChangeAccount(index, value),
    [index, onChangeAccount]
  );

  const _onChangeType = useCallback(
    (value?: number) => onChangeType(index, value),
    [index, onChangeType]
  );

  const _onRemove = useCallback(
    () => onRemove(index),
    [index, onRemove]
  );

  return (
    <div
      className='proxy-container'
      key={`addedProxy-${index}`}
    >
      <div className='input-column'>
        <InputAddress
          label={t<string>('proxy account')}
          onChange={_onChangeAccount}
          type='account'
          value={accountId}
        />
        <Dropdown
          help={'Type of proxy'}
          label={'type'}
          onChange={_onChangeType}
          options={typeOpts}
          value={type.toNumber()}
        />
      </div>
      <div className='buttons-column'>
        <Button
          icon='times'
          onClick={_onRemove}
        />
      </div>
    </div>
  );
}

function ProxyOverview ({ className, onClose, previousProxy, proxiedAccount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [batchStackPrevious, setBatchStackPrevious] = useState<SubmittableExtrinsic<'promise'>[]>([]);
  const [batchStackAdded, setBatchStackAdded] = useState<SubmittableExtrinsic<'promise'>[]>([]);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [previousProxyDisplay, setPreviousProxyDisplay] = useState<PrevProxy[] | undefined>(
    previousProxy?.[0].map(({ delegate, proxyType }): [AccountId, ProxyType] => [delegate, proxyType]) || undefined
  );
  const [addedProxies, setAddedProxies] = useState<PrevProxy[]>([]);

  useEffect(() => {
    if (batchStackPrevious.length || batchStackAdded.length) {
      setExtrinsic(() => createExtrinsic(api, batchStackPrevious, batchStackAdded));
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

        return !prevState
          ? [newProxy]
          : [...prevState, newProxy];
      });

      setBatchStackAdded((prev) => prev.concat(createAddProxy(api, newAccount, newType)));
    },
    [api, proxiedAccount]
  );

  const _delProxy = useCallback(
    (index: number) => {
      setAddedProxies((addedProxies) => addedProxies.filter((_, i) => i !== index));
      setBatchStackAdded((batchStackAdded) => batchStackAdded.filter((_, i) => i !== index));
    },
    []
  );

  const _delPrev = useCallback(
    (accountId: AccountId, type: ProxyType, index: number) => {
      setPreviousProxyDisplay((previousProxyDisplay) => previousProxyDisplay?.filter((_, i) => i !== index));
      setBatchStackPrevious((batchStackPrevious) => [...batchStackPrevious, createRmProxy(api, accountId, type)]);
    },
    [api]
  );

  const _changeProxyAccount = useCallback(
    (index: number, address: string | null) => {
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

        newBatchAdded.push(createAddProxy(api, accountId, oldType));

        return newBatchAdded;
      });
    },
    [addedProxies, api]
  );

  const _changeProxyType = useCallback(
    (index: number, newTypeNumber: number | undefined) => {
      const newType = registry.createType('ProxyType', newTypeNumber);
      const oldAccount = addedProxies[index][0];

      // update the UI with the new selected type
      setAddedProxies((prevState) => {
        const newState = [...prevState];

        newState[index][1] = newType;

        return newState;
      });

      // The Batch stack needs to be updated wit the new type
      // First, delete the corresponding extrinsic in the batch stack
      const newBatchStackAdded = batchStackAdded.filter((_, i) => i !== index);

      // Then add the new extrinsic to the batch stack with the new account
      newBatchStackAdded.push(createAddProxy(api, oldAccount, newType));
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
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            {previousProxyDisplay?.map((value, index) => (
              <PrevProxy
                index={index}
                key={`${value.toString()}-${index}`}
                onRemove={_delPrev}
                typeOpts={typeOpts}
                value={value}
              />
            ))}
            {addedProxies.map((value, index) => (
              <NewProxy
                index={index}
                key={`${value.toString()}-${index}`}
                onChangeAccount={_changeProxyAccount}
                onChangeType={_changeProxyType}
                onRemove={_delProxy}
                typeOpts={typeOpts}
                value={value}
              />
            ))}
            <Button.Group>
              <Button
                icon='plus'
                label={t<string>('Add proxy')}
                onClick={_addProxy}
              />
            </Button.Group>
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('If you add several proxy accounts for the same proxy type (e.g 2 accounts set as proxy for Governance), then any of those 2 accounts will be able to perfom governance actions on behalf of the proxied account')}</p>
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        {previousProxy && previousProxy[0].length !== 0 && (
          <TxButton
            accountId={proxiedAccount}
            icon='trash-alt'
            label={t<string>('Clear all')}
            onStart={onClose}
            params={[]}
            tx='proxy.removeProxies'
          />
        )}
        <TxButton
          accountId={proxiedAccount}
          extrinsic={extrinsic}
          icon='sign-in-alt'
          isDisabled={!batchStackPrevious.length && !batchStackAdded.length}
          onStart={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(ProxyOverview)`
  .proxy-container {
    display: grid;
    grid-column-gap: 0.5rem;
    grid-template-columns: minmax(0, 1fr) auto;
    margin-bottom: 1rem;

    .input-column {
      grid-column: 1;
    }

    .buttons-column {
      grid-column: 2;
      padding-top: 0.3rem;
    }
  }
`);
