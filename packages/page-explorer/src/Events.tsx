// Copyright 2017-2023 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '@polkadot/react-hooks/ctx/types';

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { MarkError, Table } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import Event from './Event';
import { useTranslation } from './translate.js';

interface Props {
  className?: string;
  error?: Error | null;
  emptyLabel?: React.ReactNode;
  events?: KeyedEvent[] | null;
  eventClassName?: string;
  label?: React.ReactNode;
}

function renederEvent (className: string | undefined, { blockHash, blockNumber, indexes, key, record }: KeyedEvent): React.ReactNode {
  return (
    <tr
      className={className}
      key={key}
    >
      <td className='overflow relative'>
        <Event value={record} />
        {blockNumber && (
          <div className='absolute --digits'>
            {indexes.length !== 1 && <span>{formatNumber(indexes.length)}x&nbsp;</span>}
            <Link to={`/explorer/query/${blockHash || ''}`}>{formatNumber(blockNumber)}-{indexes[0].toString().padStart(2, '0')}</Link>
          </div>
        )}
      </td>
    </tr>
  );
}

function Events ({ className = '', emptyLabel, error, eventClassName, events, label }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const header = useMemo<[React.ReactNode?, string?, number?][]>(
    () => [
      [label || t<string>('recent events'), 'start']
    ],
    [label, t]
  );

  return (
    <Table
      className={className}
      empty={emptyLabel || t<string>('No events available')}
      header={header}
    >
      {error
        ? (
          <tr
            className={eventClassName}
            key='error'
          >
            <td><MarkError content={t<string>('Unable to decode the block events. {{error}}', { replace: { error: error.message } })} /></td>
          </tr>
        )
        : events && events.map((e) => renederEvent(eventClassName, e))
      }
    </Table>
  );
}

export default React.memo(Events);
