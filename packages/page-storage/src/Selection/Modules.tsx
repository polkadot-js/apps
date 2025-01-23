// Copyright 2017-2025 @polkadot/app-storage authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { QueryableStorageEntry } from '@polkadot/api/types';
import type { RawParams, TypeDefExt } from '@polkadot/react-params/types';
import type { StorageEntryTypeLatest } from '@polkadot/types/interfaces';
import type { Inspect, Registry } from '@polkadot/types/types';
import type { ComponentProps as Props } from '../types.js';

import React, { useCallback, useMemo, useState } from 'react';

import { Button, Columar, Input, InputStorage, Inspect as DecodeInspect, Output, styled } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import Params from '@polkadot/react-params';
import { getTypeDef } from '@polkadot/types';
import { getSiName } from '@polkadot/types/metadata/util';
import { TypeDefInfo } from '@polkadot/types/types';
import { compactStripLength, isHex, isNull, isUndefined, u8aToHex } from '@polkadot/util';

import { useTranslation } from '../translate.js';

type ParamsType = { name?: string, type: TypeDefExt }[];

interface KeyState {
  defaultValues: RawParams | undefined | null;
  isIterable: boolean;
  key: QueryableStorageEntry<'promise'>;
  params: ParamsType;
}

interface ValState {
  isValid: boolean;
  values: RawParams;
}

interface BlockHash {
  blockHash: string | null;
  textHash: string;
}

function areParamsValid ({ creator: { meta: { type } } }: QueryableStorageEntry<'promise'>, values: RawParams): boolean {
  return values.reduce((isValid: boolean, value) =>
    isValid &&
    !isUndefined(value) &&
    !isUndefined(value.value) &&
    value.isValid,
  (values.length === (type.isPlain ? 0 : type.asMap.hashers.length)));
}

function expandParams (registry: Registry, st: StorageEntryTypeLatest, isIterable: boolean): ParamsType {
  let types: string[] = [];

  if (st.isMap) {
    const { hashers, key } = st.asMap;

    types = hashers.length === 1
      ? [getSiName(registry.lookup, key)]
      : registry.lookup.getSiType(key).def.asTuple.map((k) => getSiName(registry.lookup, k));
  }

  return types.map((str, index) => {
    let name: string | undefined;
    let type: TypeDefExt;

    if (isIterable && index === (types.length - 1)) {
      // name = 'entryKey';
      type = getTypeDef(`Option<${str}>`);
      type.withOptionActive = true;
    } else {
      type = getTypeDef(str);
    }

    return { name, type };
  });
}

function checkIterable (registry: Registry, type: StorageEntryTypeLatest): boolean {
  // in the case of Option<type> keys, we don't allow map iteration, in this case
  // we would have option for the iterable and then option for the key value
  if (type.isPlain) {
    return true;
  }

  const { hashers, key } = type.asMap;

  if (hashers.length === 1) {
    return registry.lookup.getTypeDef(key).info !== TypeDefInfo.Option;
  }

  const keys = registry.lookup.getSiType(key).def.asTuple;

  return registry.lookup.getTypeDef(keys[keys.length - 1]).info !== TypeDefInfo.Option;
}

function expandKey (api: ApiPromise, key: QueryableStorageEntry<'promise'>): KeyState {
  const { creator: { meta: { type }, section } } = key;
  const isIterable = checkIterable(api.registry, type);

  return {
    defaultValues: section === 'session' && type.isMap && api.consts.session?.dedupKeyPrefix
      ? [{ isValid: true, value: api.consts.session.dedupKeyPrefix.toHex() }]
      : null,
    isIterable,
    key,
    params: expandParams(api.registry, type, isIterable)
  };
}

function extractParams (isIterable: boolean, values: RawParams): [RawParams, boolean] {
  const params = values.filter(({ value }, index) => !isIterable || (index !== values.length - 1) || !isNull(value));

  return [params, params.length === values.length];
}

function Modules ({ className = '', onAdd }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [{ defaultValues, isIterable, key, params }, setKey] = useState<KeyState>(() => ({ defaultValues: undefined, isHeadKey: true, isIterable: false, key: api.query.timestamp?.now || api.query.system.events, params: [] }));
  const [{ isValid, values }, setValues] = useState<ValState>(() => ({ isValid: true, values: [] }));
  const [{ blockHash, textHash }, setBlockHash] = useState<BlockHash>({ blockHash: null, textHash: '' });

  const startValue = useMemo(
    () => (
      api.query.timestamp?.now ||
      api.query.system?.events ||
      api.query.substrate.changesTrieConfig
    ),
    [api]
  );

  const [isPartialKey, hexKey, inspect] = useMemo(
    (): [boolean, string, Inspect | null] => {
      if (isValid) {
        try {
          const [params] = extractParams(isIterable, values);
          const args = params.map(({ value }) => value);
          const isPartialKey = args.length !== (
            key.creator.meta.type.isPlain
              ? 0
              : key.creator.meta.type.asMap.hashers.length
          );
          const hexKey = isPartialKey && key.creator.iterKey
            ? key.creator.iterKey(...args).toHex()
            : u8aToHex(compactStripLength(key.creator(...args))[1]);
          const inspect = isPartialKey
            ? null
            : key.creator.inspect(...args);

          return [isPartialKey, hexKey, inspect];
        } catch {
          // ignore
        }
      }

      return [false, '0x', null];
    },
    [isIterable, isValid, key, values]
  );

  const _onAdd = useCallback(
    (): void => {
      const [params, isAtEnabled] = extractParams(isIterable, values);

      isValid && onAdd({
        blockHash: isAtEnabled
          ? blockHash
          : null,
        isConst: false,
        key,
        params
      });
    },
    [blockHash, isIterable, isValid, key, onAdd, values]
  );

  const _onChangeAt = useCallback(
    (textHash: string) => setBlockHash({
      blockHash: isHex(textHash, 256)
        ? textHash
        : null,
      textHash
    }),
    []
  );

  const _onChangeValues = useCallback(
    (values: RawParams) => setValues({
      isValid: areParamsValid(key, values),
      values
    }),
    [key]
  );

  const _onChangeKey = useCallback(
    (key: QueryableStorageEntry<'promise'>): void => {
      setKey(expandKey(api, key));
      _onChangeValues([]);
    },
    [_onChangeValues, api]
  );

  const isAtAllowed = useMemo(
    () => isValid
      ? extractParams(isIterable, values)[1]
      : false,
    [isIterable, isValid, values]
  );

  const { creator: { method, section } } = key;

  return (
    <StyledSection className={`${className} storage--actionrow`}>
      <div className='storage--actionrow-value'>
        <InputStorage
          defaultValue={startValue}
          label={t('selected state query')}
          onChange={_onChangeKey}
        />
        <Params
          key={`${section}.${method}:params` /* force re-render on change */}
          onChange={_onChangeValues}
          onEnter={_onAdd}
          params={params}
          values={defaultValues}
        />
        <Input
          isDisabled={!isValid || !isAtAllowed}
          isError={!!textHash && !blockHash}
          label={t('blockhash to query at')}
          onChange={_onChangeAt}
          placeholder={t('0x...')}
        />
        <Columar
          className='keyColumar'
          isPadded={false}
        >
          <Columar.Column>
            <Output
              isDisabled
              label={isPartialKey
                ? t('encoded partial key')
                : t('encoded storage key')
              }
              value={hexKey}
              withCopy
            />
          </Columar.Column>
          <Columar.Column>
            <DecodeInspect
              inspect={inspect}
              label={t('encoded key details')}
            />
          </Columar.Column>
        </Columar>
      </div>
      <div className='storage--actionrow-buttons'>
        <Button
          icon='plus'
          isDisabled={!isValid}
          onClick={_onAdd}
        />
      </div>
    </StyledSection>
  );
}

const StyledSection = styled.section`
  .ui--Column:last-child .ui--Labelled {
    padding-left: 0.5rem;

    label {
      left: 2.05rem; /* 3.55 - 1.5 (diff from padding above) */
    }
  }
`;

export default React.memo(Modules);
