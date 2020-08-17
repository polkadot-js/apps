// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SlashEra } from './types';

import React, { useRef } from 'react';
import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Row from './Row';
import Summary from './Summary';

interface Props {
  slash: SlashEra;
}

function Slashes ({ slash }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  const headerRef = useRef<[string?, string?, number?][]>([
    [undefined, 'start', 3],
    [t('reporters'), 'address'],
    [t('own')],
    [t('other')],
    [t('total')],
    [t('payout')]
  ]);

  return (
    <Table header={[[t('era {{era}}/unapplied', { replace: { era: slash.era.toString() } }), 'start', 8]]}>
      <Summary slash={slash} />
      <tr className='transparent'>
        {headerRef.current.map(([label, className, colSpan = 1], index): React.ReactNode => (
          <td
            className={className}
            colSpan={colSpan}
            key={index}
          >
            <label>{label}</label>
          </td>
        ))}
      </tr>
      {slash.slashes.map((slash, index): React.ReactNode => (
        <Row
          key={index}
          slash={slash}
        />
      ))}
    </Table>
  );
}

export default React.memo(Slashes);
