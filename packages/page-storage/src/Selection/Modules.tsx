// Copyright 2017-2020 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueryableStorageEntry } from '@polkadot/api/types';
import { StorageEntryTypeLatest } from '@polkadot/types/interfaces';
import { TypeDef, TypeDefInfo } from '@polkadot/types/types';
import { RawParams } from '@polkadot/react-params/types';
import { ComponentProps as Props } from '../types';

import React, { useCallback, useState } from 'react';
import ApiPromise from '@polkadot/api/promise';
import { Button, InputStorage } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import Params from '@polkadot/react-params';
import { getTypeDef } from '@polkadot/types';
import { isNull, isUndefined } from '@polkadot/util';

import { useTranslation } from '../translate';

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

interface TypeDefExt extends TypeDef {
  withOptionActive?: boolean;
}

type ParamsType = { type: TypeDefExt }[];

function areParamsValid ({ creator: { meta: { type } } }: QueryableStorageEntry<'promise'>, values: RawParams): boolean {
  return values.reduce((isValid: boolean, value): boolean => {
    return isValid &&
    !isUndefined(value) &&
    !isUndefined(value.value) &&
    value.isValid;
  }, (
    type.isDoubleMap
      ? values.length === 2
      : values.length === (type.isMap ? 1 : 0)
  ));
}

function expandParams (st: StorageEntryTypeLatest, isIterable: boolean): ParamsType {
  let types: string[] = [];

  if (st.isDoubleMap) {
    types = [st.asDoubleMap.key1.toString(), st.asDoubleMap.key2.toString()];
  } else if (st.isMap) {
    types = [st.asMap.key.toString()];
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

function checkIterable (api: ApiPromise, type: StorageEntryTypeLatest): boolean {
  let def;

  if (!api.rpc.state.queryStorageAt) {
    return type.isMap && type.asMap.linked.isTrue;
  } else if (type.isMap) {
    def = getTypeDef(type.asMap.key.toString());
  } else if (type.isDoubleMap) {
    def = getTypeDef(type.asDoubleMap.key2.toString());
  }

  // in the case of Option<type> keys, we don't allow map iteration, in this case
  // we would have option for the iterable and then option for the key value
  return !!def && def.info !== TypeDefInfo.Option;
}

function expandKey (api: ApiPromise, key: QueryableStorageEntry<'promise'>): KeyState {
  const { creator: { meta: { type }, section } } = key;
  const isIterable = checkIterable(api, type);

  return {
    defaultValues: section === 'session' && type.isDoubleMap
      ? [{ isValid: true, value: api.consts.session.dedupKeyPrefix.toHex() }]
      : null,
    isIterable,
    key,
    params: expandParams(type, isIterable)
  };
}

function Modules ({ onAdd }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [{ defaultValues, isIterable, key, params }, setKey] = useState<KeyState>({ defaultValues: undefined, isIterable: false, key: api.query.timestamp.now, params: [] });
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
          defaultValue={api.query.timestamp.now}
          help={meta?.documentation.join(' ')}
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
