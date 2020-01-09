// Copyright 2017-2020 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef } from '@polkadot/types/types';
import { I18nProps } from '@polkadot/react-components/types';
import { RawParams } from '@polkadot/react-params/types';
import { ComponentProps, StorageEntryPromise } from '../types';

import React, { useState } from 'react';
import { getTypeDef } from '@polkadot/types';
import { Button, InputStorage } from '@polkadot/react-components';
import Params from '@polkadot/react-params';
import { useApi } from '@polkadot/react-hooks';
import { isNull, isUndefined } from '@polkadot/util';

import translate from '../translate';

interface Props extends ComponentProps, I18nProps {}

type ParamsType = { type: TypeDef }[];

function areParamsValid (values: RawParams): boolean {
  return values.reduce(
    (isValid: boolean, value): boolean => (
      isValid &&
      !isUndefined(value) &&
      !isUndefined(value.value) &&
      value.isValid),
    true
  );
}

function Modules ({ onAdd, t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const [{ defaultValues, isIterable, key, params }, setKey] = useState<{ defaultValues: RawParams | undefined | null; isIterable: boolean; key: StorageEntryPromise; params: ParamsType }>({ defaultValues: undefined, isIterable: false, key: api.query.timestamp.now, params: [] });
  const [{ isValid, values }, setValues] = useState<{ isValid: boolean; values: RawParams }>({ isValid: true, values: [] });

  const _onAdd = (): void => {
    isValid && onAdd({
      isConst: false,
      key,
      params: values.filter(({ value }): boolean => !isIterable || !isNull(value))
    });
  };
  const _onChangeValues = (values: RawParams): void => {
    setValues({
      isValid: (
        key.creator.meta.type.isDoubleMap
          ? values.length === 2
          : values.length === (key.creator.meta.type.isMap ? 1 : 0)
      ) && areParamsValid(values),
      values
    });
  };
  const _onChangeKey = (key: StorageEntryPromise): void => {
    const asMap = key.creator.meta.type.isMap && key.creator.meta.type.asMap;
    const isIterable = !!asMap && (asMap.kind.isLinkedMap || asMap.kind.isPrefixedMap);

    setKey({
      defaultValues: key.creator.section === 'session' && key.creator.meta.type.isDoubleMap
        ? [{ isValid: true, value: api.consts.session.dedupKeyPrefix.toHex() }]
        : null,
      isIterable,
      key,
      params: key.creator.meta.type.isDoubleMap
        ? [
          { type: getTypeDef(key.creator.meta.type.asDoubleMap.key1.toString()) },
          { type: getTypeDef(key.creator.meta.type.asDoubleMap.key2.toString()) }
        ]
        : asMap
          ? [{
            type: getTypeDef(
              isIterable
                ? `Option<${asMap.key.toString()}>`
                : asMap.key.toString()
            )
          }]
          : []
    });

    _onChangeValues([]);
  };

  const { creator: { method, section, meta } } = key;

  return (
    <section className='storage--actionrow'>
      <div className='storage--actionrow-value'>
        <InputStorage
          defaultValue={api.query.timestamp.now}
          label={t('selected state query')}
          onChange={_onChangeKey}
          help={meta?.documentation.join(' ')}
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
          isPrimary
          onClick={_onAdd}
        />
      </div>
    </section>
  );
}

export default translate(Modules);
