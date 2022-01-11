// Copyright 2017-2022 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '@polkadot/react-query/types';

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Table } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import Event from './Event';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  emptyLabel?: React.ReactNode;
  events?: KeyedEvent[];
  eventClassName?: string;
  label?: React.ReactNode;
}

function Events ({ className = '', emptyLabel, eventClassName, events, label }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const header = useMemo(() => [
    [label || t<string>('recent events'), 'start']
  ], [label, t]);

  return (
    <Table
      className={className}
      empty={emptyLabel || t<string>('No events available')}
      header={header}
    >
      {events && events.map(({ blockHash, blockNumber, indexes, key, record }): React.ReactNode => (
        <tr
          className={eventClassName}
          key={key}
        >
          <td className='overflow'>
            <Event value={record} />
            {blockNumber && (
              <div className='event-link'>
                {indexes.length !== 1 && <span>({formatNumber(indexes.length)}x)&nbsp;</span>}
                <Link to={`/explorer/query/${blockHash || ''}`}>{formatNumber(blockNumber)}-{indexes[0]}</Link>
              </div>
            )}
          </td>
        </tr>
      ))}
    </Table>
  );
}

export default React.memo(styled(Events)`
  td.overflow {
    position: relative;

    .event-link {
      position: absolute;
      right: 0.75rem;
      top: 0.5rem;
    }
  }
`);
