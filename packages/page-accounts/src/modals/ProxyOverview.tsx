// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { BatchOptions } from '@polkadot/react-hooks/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { KitchensinkRuntimeProxyType, PalletProxyProxyDefinition } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { BatchWarning, Button, Dropdown, InputAddress, InputBalance, MarkError, Modal, styled, TxButton } from '@polkadot/react-components';
import { useApi, useTxBatch } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../translate.js';

type PrevProxyProp = [AccountId | null, KitchensinkRuntimeProxyType];

interface Props {
  className?: string;
  onClose: () => void;
  previousProxy?: [PalletProxyProxyDefinition[], BN];
  proxiedAccount: string;
}

interface ValueProps {
  index: number;
  typeOpts: { text: string; value: number }[];
  value: PrevProxyProp;
}

interface NewProxyProps extends ValueProps {
  onChangeAccount: (index: number, value: string | null) => void;
  onChangeType: (index: number, value: number | undefined) => void;
  onRemove: (index: number) => void;
  proxiedAccount: string;
}

interface PrevProxyProps extends ValueProps {
  onRemove: (accountId: AccountId, type: KitchensinkRuntimeProxyType, index: number) => void;
}

const BATCH_OPTS: BatchOptions = { type: 'all' };
const EMPTY_EXISTING: [PalletProxyProxyDefinition[], BN] = [[], BN_ZERO];

function createAddProxy (api: ApiPromise, account: AccountId, type: KitchensinkRuntimeProxyType, delay = 0): SubmittableExtrinsic<'promise'> {
  return api.tx.proxy.addProxy.meta.args.length === 2
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore old version
    ? api.tx.proxy.addProxy(account, type)
    : api.tx.proxy.addProxy(account, type, delay);
}

function createRmProxy (api: ApiPromise, account: AccountId, type: KitchensinkRuntimeProxyType, delay = 0): SubmittableExtrinsic<'promise'> {
  return api.tx.proxy.removeProxy.meta.args.length === 2
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore old version
    ? api.tx.proxy.removeProxy(account, type)
    : api.tx.proxy.removeProxy(account, type, delay);
}

function PrevProxy ({ index, onRemove, typeOpts, value: [accountId, type] }: PrevProxyProps): React.ReactElement<PrevProxyProps> {
  const { t } = useTranslation();

  const _onRemove = useCallback(
    (): void => {
      accountId && onRemove(accountId, type, index);
    },
    [accountId, index, onRemove, type]
  );

  return (
    <div className='proxy-container'>
      <div className='input-column'>
        <InputAddress
          defaultValue={accountId}
          isDisabled
          label={t('proxy account')}
        />
        <Dropdown
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

function NewProxy ({ index, onChangeAccount, onChangeType, onRemove, proxiedAccount, typeOpts, value: [accountId, type] }: NewProxyProps): React.ReactElement<NewProxyProps> {
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
          isError={!accountId}
          label={t('proxy account')}
          onChange={_onChangeAccount}
          type='allPlus'
          value={accountId}
        />
        {accountId && accountId.eq(proxiedAccount) && (
          <MarkError content={t('You should not setup proxies to act as a self-proxy.')} />
        )}
        <Dropdown
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

function getProxyTypeInstance (api: ApiPromise, index = 0): KitchensinkRuntimeProxyType {
  // This is not perfect, but should work for `{Kusama, Node, Polkadot}RuntimeProxyType`
  const proxyNames = api.registry.lookup.names.filter((name) => name.endsWith('RuntimeProxyType'));

  // fallback to previous version (may be Substrate default), when not found
  return api.createType<KitchensinkRuntimeProxyType>(proxyNames.length ? proxyNames[0] : 'ProxyType', index);
}

function getProxyOptions (api: ApiPromise): { text: string; value: number; }[] {
  return getProxyTypeInstance(api).defKeys
    .map((text, value) => ({ text, value }))
    // Filter the empty entries added in v14
    .filter(({ text }) => !text.startsWith('__Unused'));
}

function ProxyOverview ({ className, onClose, previousProxy: [existing] = EMPTY_EXISTING, proxiedAccount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [batchPrevious, setBatchPrevious] = useState<SubmittableExtrinsic<'promise'>[]>([]);
  const [batchAdded, setBatchAdded] = useState<SubmittableExtrinsic<'promise'>[]>([]);
  const [txs, setTxs] = useState<SubmittableExtrinsic<'promise'>[] | null>(null);
  const [previous, setPrevious] = useState<PrevProxyProp[]>(() => existing.map(({ delegate, proxyType }) => [delegate, proxyType]));
  const [added, setAdded] = useState<PrevProxyProp[]>([]);
  const extrinsics = useTxBatch(txs, BATCH_OPTS);

  const reservedAmount = useMemo(
    () => api.consts.proxy.proxyDepositFactor
      .muln(batchPrevious.length + batchAdded.length)
      .iadd(api.consts.proxy.proxyDepositBase),
    [api, batchPrevious, batchAdded]
  );

  const typeOpts = useRef(getProxyOptions(api));

  useEffect((): void => {
    setBatchAdded(
      added
        .filter((f): f is [AccountId, KitchensinkRuntimeProxyType] => !!f[0])
        .map(([newAccount, newType]) => createAddProxy(api, newAccount, newType))
    );
  }, [api, added]);

  useEffect((): void => {
    setTxs(() => [...batchPrevious, ...batchAdded]);
  }, [batchPrevious, batchAdded]);

  const _addProxy = useCallback(
    () => setAdded((added) =>
      [...added, [
        added.length
          ? added[added.length - 1][0]
          : previous.length
            ? previous[previous.length - 1][0]
            : api.createType('AccountId', proxiedAccount),
        getProxyTypeInstance(api)
      ]]
    ),
    [api, previous, proxiedAccount]
  );

  const _delProxy = useCallback(
    (index: number) => setAdded((added) => added.filter((_, i) => i !== index)),
    []
  );

  const _delPrev = useCallback(
    (accountId: AccountId, type: KitchensinkRuntimeProxyType, index: number): void => {
      setPrevious((previous) => previous.filter((_, i) => i !== index));
      setBatchPrevious((previous) => [...previous, createRmProxy(api, accountId, type)]);
    },
    [api]
  );

  const _changeProxyAccount = useCallback(
    (index: number, address: string | null) => setAdded((prevState) => {
      const newState = [...prevState];

      newState[index][0] = address
        ? api.createType('AccountId', address)
        : null;

      return newState;
    }),
    [api]
  );

  const _changeProxyType = useCallback(
    (index: number, newTypeNumber: number | undefined): void =>
      setAdded((added) => {
        const newState = [...added];

        newState[index][1] = getProxyTypeInstance(api, newTypeNumber);

        return newState;
      }),
    [api]
  );

  const isSameAdd = added.some(([accountId]) => accountId && accountId.eq(proxiedAccount));

  return (
    <StyledModal
      className={className}
      header={t('Proxy overview')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t('Any account set as proxy will be able to perform actions in place of the proxied account')}>
          <InputAddress
            isDisabled={true}
            label={t('proxied account')}
            type='account'
            value={proxiedAccount}
          />
        </Modal.Columns>
        <Modal.Columns hint={t('If you add several proxy accounts for the same proxy type (e.g 2 accounts set as proxy for Governance), then any of those 2 accounts will be able to perform governance actions on behalf of the proxied account')}>
          {previous.map((value, index) => (
            <PrevProxy
              index={index}
              key={`${value.toString()}-${index}`}
              onRemove={_delPrev}
              typeOpts={typeOpts.current}
              value={value}
            />
          ))}
          {added.map((value, index) => (
            <NewProxy
              index={index}
              key={`${value.toString()}-${index}`}
              onChangeAccount={_changeProxyAccount}
              onChangeType={_changeProxyType}
              onRemove={_delProxy}
              proxiedAccount={proxiedAccount}
              typeOpts={typeOpts.current}
              value={value}
            />
          ))}
          <Button.Group>
            <Button
              icon='plus'
              label={t('Add proxy')}
              onClick={_addProxy}
            />
          </Button.Group>
        </Modal.Columns>
        <Modal.Columns hint={t('A deposit paid by the proxied account that can not be used while the proxy is in existence. The deposit is returned when the proxy is destroyed. The amount reserved is based on the base deposit and number of proxies')}>
          <InputBalance
            defaultValue={reservedAmount}
            isDisabled
            label={t('reserved balance')}
          />
        </Modal.Columns>
        <Modal.Columns>
          <BatchWarning />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        {existing.length !== 0 && (
          <TxButton
            accountId={proxiedAccount}
            icon='trash-alt'
            label={t('Clear all')}
            onStart={onClose}
            tx={api.tx.proxy.removeProxies}
          />
        )}
        <TxButton
          accountId={proxiedAccount}
          extrinsic={extrinsics}
          icon='sign-in-alt'
          isDisabled={isSameAdd || (!batchPrevious.length && !batchAdded.length)}
          onStart={onClose}
        />
      </Modal.Actions>
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
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
`;

export default React.memo(ProxyOverview);
