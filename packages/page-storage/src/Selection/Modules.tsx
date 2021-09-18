// Copyright 2017-2021 @polkadot/app-storage authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { QueryableStorageEntry } from '@polkadot/api/types';
import type { RawParams } from '@polkadot/react-params/types';
import type { SiLookupTypeId, StorageEntryTypeLatest } from '@polkadot/types/interfaces';
import type { Registry, TypeDef } from '@polkadot/types/types';
import type { ComponentProps as Props } from '../types';

import React, { useCallback, useState } from 'react';

import { ApiPromise } from '@polkadot/api';
import { Button, InputStorage } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import Params from '@polkadot/react-params';
import { getTypeDef } from '@polkadot/types';
import { TypeDefInfo } from '@polkadot/types/types';
import { isNull, isUndefined } from '@polkadot/util';

import { useTranslation } from '../translate';

interface TypeDefExt extends TypeDef {
  withOptionActive?: boolean;
}

type ParamsType = { type: TypeDefExt }[];

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

function areParamsValid ({ creator: { meta: { type } } }: QueryableStorageEntry<'promise'>, values: RawParams): boolean {
  return values.reduce((isValid: boolean, value) =>
    isValid &&
    !isUndefined(value) &&
    !isUndefined(value.value) &&
    value.isValid,
  (values.length === (type.isPlain ? 0 : type.asMap.hashers.length)));
}

function expandSiKey (registry: Registry, key: SiLookupTypeId): string {
  const typeDef = registry.lookup.getTypeDef(key);

  return typeDef.lookupName || typeDef.type;
}

function expandParams (registry: Registry, st: StorageEntryTypeLatest, isIterable: boolean): ParamsType {
  let types: string[] = [];

  if (st.isMap) {
    const { hashers, key } = st.asMap;

    types = hashers.length === 1
      ? [expandSiKey(registry, key)]
      : registry.lookup.getSiType(key).def.asTuple.map((k) => expandSiKey(registry, k));
  }

  return types.map((str, index) => {
    let type: TypeDefExt;

    if (isIterable && index === (types.length - 1)) {
      type = getTypeDef(`Option<${str}>`);
      type.withOptionActive = true;
    } else {
      type = getTypeDef(str);
    }

    return { type };
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
    defaultValues: section === 'session' && type.isMap
      ? [{ isValid: true, value: api.consts.session.dedupKeyPrefix.toHex() }]
      : null,
    isIterable,
    key,
    params: expandParams(api.registry, type, isIterable)
  };
}

function Modules ({ onAdd }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [{ defaultValues, isIterable, key, params }, setKey] = useState<KeyState>({ defaultValues: undefined, isIterable: false, key: api.query.timestamp?.now || api.query.system.events, params: [] });
  const [{ isValid, values }, setValues] = useState<ValState>({ isValid: true, values: [] });

  const _onAdd = useCallback(
    (): void => {
      isValid && onAdd({
        isConst: false,
        key,
        params: values.filter(({ value }, index) => !isIterable || (index !== values.length - 1) || !isNull(value))
      });
    },
    [isIterable, isValid, key, onAdd, values]
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

  const { creator: { meta, method, section } } = key;

  return (
    <section className='storage--actionrow'>
      <div className='storage--actionrow-value'>
        <InputStorage
          defaultValue={api.query.timestamp?.now || api.query.system.events}
          help={meta?.docs.join(' ')}
          label={t<string>('selected state query')}
          onChange={_onChangeKey}
        />
        <Params
          key={`${section}.${method}:params` /* force re-render on change */}
          onChange={_onChangeValues}
          onEnter={_onAdd}
          params={params}
          values={defaultValues}
        />
      </div>
      <div className='storage--actionrow-buttons'>
        <Button
          icon='plus'
          isDisabled={!isValid}
          onClick={_onAdd}
        />
      </div>
    </section>
  );
}

export default React.memo(Modules);
