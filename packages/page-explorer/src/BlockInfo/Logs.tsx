// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DigestItem } from '@polkadot/types/interfaces';
import { Codec, TypeDef } from '@polkadot/types/types';

import React from 'react';
import { Struct, Tuple, Raw, Vec, getTypeDef } from '@polkadot/types';
import { Column, Expander, Table } from '@polkadot/react-components';
import Params from '@polkadot/react-params';

import { useTranslation } from '../translate';

interface Props {
  value?: DigestItem[];
}

function formatU8a (value: Raw): React.ReactNode {
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

function formatItem (item: DigestItem): React.ReactNode {
  if (item.value instanceof Struct) {
    return formatStruct(item.value);
  } else if (item.value instanceof Tuple) {
    return formatTuple(item.value);
  } else if (item.value instanceof Vec) {
    return formatVector(item.value);
  } else if (item.value instanceof Raw) {
    return formatU8a(item.value);
  }

  return <div>{item.value.toString().split(',').join(', ')}</div>;
}

function Logs (props: Props): React.ReactElement<Props> | null {
  const { value } = props;
  const { t } = useTranslation();

  if (!value || !value.length) {
    return null;
  }

  return (
    <Column>
      <Table>
        <Table.Head>
          <th className='start'><h1>{t('logs')}</h1></th>
        </Table.Head>
        <Table.Body>
          {value.map((log, index) => (
            <tr key={`log:${index}`}>
              <td className='overflow'>
                <div>{log.type.toString()}</div>
                <Expander summary={t('Details')}>
                  {formatItem(log)}
                </Expander>
              </td>
            </tr>
          ))}
        </Table.Body>
      </Table>
    </Column>
  );
}

export default React.memo(Logs);
