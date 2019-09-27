// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DigestItem } from '@polkadot/types/interfaces';
import { Codec, TypeDef } from '@polkadot/types/types';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { Struct, Tuple, U8a, Vec, getTypeDef } from '@polkadot/types';
import { Column } from '@polkadot/react-components';
import Params from '@polkadot/react-params';

import translate from '../translate';

interface Props extends I18nProps {
  value?: DigestItem[];
}

function formatU8a (value: U8a): React.ReactNode {
  return (
    <Params
      isDisabled
      params={[{ type: getTypeDef('Bytes') }]}
      values={[{ isValid: true, value }]}
    />
  );
}

function formatStruct (struct: Struct): React.ReactNode {
  const types: Record<string, string> = struct.Type;
  const params = Object.keys(types).map((name): { name: string; type: TypeDef } => ({
    name,
    type: getTypeDef(types[name])
  }));
  const values = struct.toArray().map((value): { isValid: boolean; value: Codec } => ({
    isValid: true,
    value
  }));

  return (
    <Params
      isDisabled
      params={params}
      values={values}
    />
  );
}

function formatTuple (tuple: Tuple): React.ReactNode {
  const types = tuple.Types;
  const params = types.map((type): { type: TypeDef } => ({
    type: getTypeDef(type)
  }));
  const values = tuple.toArray().map((value): { isValid: boolean; value: Codec } => ({
    isValid: true,
    value
  }));

  return (
    <Params
      isDisabled
      params={params}
      values={values}
    />
  );
}

function formatVector (vector: Vec<any>): React.ReactNode {
  const type = getTypeDef(vector.Type);
  const values = vector.toArray().map((value): { isValid: boolean; value: Codec } => ({
    isValid: true,
    value
  }));
  const params = values.map((_, index): { name: string; type: TypeDef } => ({
    name: `${index}`,
    type
  }));

  return (
    <Params
      isDisabled
      params={params}
      values={values}
    />
  );
}

function renderItem ({ t }: Props): (item: DigestItem, index: number) => React.ReactNode {
  return function LogItem (item: DigestItem, index: number): React.ReactNode {
    let content: React.ReactNode;

    if (item.value instanceof Struct) {
      content = formatStruct(item.value);
    } else if (item.value instanceof Tuple) {
      content = formatTuple(item.value);
    } else if (item.value instanceof Vec) {
      content = formatVector(item.value);
    } else if (item.value instanceof U8a) {
      content = formatU8a(item.value);
    } else {
      content = <div>{item.value.toString().split(',').join(', ')}</div>;
    }

    return (
      <div
        className='explorer--BlockByHash-block'
        key={index}
      >
        <article className='explorer--Container'>
          <div className='header'>
            <h3>{item.type.toString()}</h3>
          </div>
          <details>
            <summary>{t('Details')}</summary>
            {content}
          </details>
        </article>
      </div>
    );
  };
}

function Logs (props: Props): React.ReactElement<Props> | null {
  const { t, value } = props;

  if (!value || !value.length) {
    return null;
  }

  return (
    <Column headerText={t('logs')}>
      {value.map(renderItem(props))}
    </Column>
  );
}

export default translate(Logs);
