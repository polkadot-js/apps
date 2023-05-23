// Copyright 2017-2023 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';

import { AddressMini, Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import useSessionDisputes from './useSessionDisputes.js';

interface Props {
  className?: string;
}

function Disputes ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const disputeInfo = useSessionDisputes();

  const headerRef = useRef<[React.ReactNode?, string?, number?][]>([
    [t<string>('disputes'), 'start', 2]
  ]);

  return (
    <Table
      className={className}
      empty={disputeInfo?.disputes && t<string>('No ongoing disputes found')}
      header={headerRef.current}
    >
      {disputeInfo?.disputes && Object
        .entries(disputeInfo?.disputes)
        .map(([d, v]) => (
          <tr key={d}>
            <td>{d}</td>
            <td className='all'>
              {v.map((v) => (
                <AddressMini
                  key={v}
                  value={v}
                />
              ))}
            </td>
          </tr>
        ))
      }
    </Table>
  );
}

export default React.memo(Disputes);
