// Copyright 2017-2020 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef } from '@polkadot/types/types';
import { RawParams } from '@polkadot/react-params/types';
import { ComponentProps as Props, StorageEntryPromise } from '../types';

import React, { useCallback, useState } from 'react';
import ApiPromise from '@polkadot/api/promise';
import { Button, InputStorage } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import Params from '@polkadot/react-params';
import { getTypeDef } from '@polkadot/types';
import { isNull, isUndefined } from '@polkadot/util';

import { useTranslation } from '../translate';

type ParamsType = { type: TypeDef }[];

interface KeyState {
  defaultValues: RawParams | undefined | null;
  isIterable: boolean;
  key: StorageEntryPromise;
  params: ParamsType;
}

function areParamsValid ({ creator: { meta: { type } } }: StorageEntryPromise, values: RawParams): boolean {
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

function expandKey (api: ApiPromise, key: StorageEntryPromise): KeyState {
  const { creator: { meta: { type }, section } } = key;

  return {
    defaultValues: section === 'session' && type.isDoubleMap
      ? [{ isValid: true, value: api.consts.session.dedupKeyPrefix.toHex() }]
      : null,
    isIterable: type.isMap && type.asMap.linked.isTrue,
    key,
    params: type.isDoubleMap
      ? [
        { type: getTypeDef(type.asDoubleMap.key1.toString()) },
        { type: getTypeDef(type.asDoubleMap.key2.toString()) }
      ]
      : type.isMap
        ? [{
          type: getTypeDef(
            type.asMap.linked.isTrue
              ? `Option<${type.asMap.key.toString()}>`
              : type.asMap.key.toString()
          )
        }]
        : []
  };
}

function Modules ({ onAdd }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [{ defaultValues, isIterable, key, params }, setKey] = useState<KeyState>({ defaultValues: undefined, isIterable: false, key: api.query.timestamp.now, params: [] });
  const [{ isValid, values }, setValues] = useState<{ isValid: boolean; values: RawParams }>({ isValid: true, values: [] });

  const _onAdd = useCallback(
    (): void => {
      isValid && onAdd({
        isConst: false,
        key,
        params: values.filter(({ value }): boolean => !isIterable || !isNull(value))
      });
    },
    [isIterable, isValid, key, onAdd, values]
  );

  const _onChangeValues = useCallback(
    (values: RawParams): void =>
      setValues({
        isValid: areParamsValid(key, values),
        values
      }),
    [key]
  );

  const _onChangeKey = useCallback(
    (key: StorageEntryPromise): void => {
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
