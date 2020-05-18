// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyedEvent } from './types';

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

function Events ({ className, emptyLabel, eventClassName, events, label }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const header = useMemo(() => [
    [label || t('recent events'), 'start']
  ], [label, t]);

  return (
    <Table
      className={className}
      empty={emptyLabel || t('No events available')}
      header={header}
    >
      {events && events
        .filter(({ record: { event: { method, section } } }) => !!method && !!section)
        .map(({ blockHash, blockNumber, index, key, record }): React.ReactNode => (
          <tr
            className={eventClassName}
            key={key}
          >
            <td className='overflow'>
              <Event value={record} />
              {blockNumber && (
                <Link
                  className='event-link'
                  to={`/explorer/query/${blockHash}`}>{formatNumber(blockNumber)}-{index}</Link>
              )}
            </td>
          </tr>
        ))
      }
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
