// Copyright 2017-2022 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, Tuple } from '@polkadot/types';
import type { Justifications } from '@polkadot/types/interfaces';
import type { Codec, TypeDef } from '@polkadot/types/types';

import React, { useRef } from 'react';

import { Expander, Table } from '@polkadot/react-components';
import Params from '@polkadot/react-params';
import { getTypeDef } from '@polkadot/types/create';

import { useTranslation } from '../translate';

interface Props {
  value: Option<Justifications>;
}

function formatTuple (tuple: Tuple): React.ReactNode {
  const params = tuple.Types.map((type): { type: TypeDef } => ({
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

function JustificationList ({ value }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  const headerRef = useRef([
    [t('justifications'), 'start']
  ]);

  const justifications = value.unwrapOr(null);

  if (!justifications) {
    return null;
  }

  return (
    <Table
      empty={t<string>('No justifications available')}
      header={headerRef.current}
    >
      {justifications?.map((justification, index) => (
        <tr key={`justification:${index}`}>
          <td className='overflow'>
            <Expander summary={justification[0].toString()}>
              {formatTuple(justification as unknown as Tuple)}
            </Expander>
          </td>
        </tr>
      ))}
    </Table>
  );
}

export default React.memo(JustificationList);
