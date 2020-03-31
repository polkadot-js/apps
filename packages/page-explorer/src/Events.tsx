// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EventRecord } from '@polkadot/types/interfaces';

import React from 'react';
import { Table } from '@polkadot/react-components';

import Event from './Event';
import { useTranslation } from './translate';

interface Props {
  emptyLabel?: React.ReactNode;
  events: EventRecord[];
  eventClassName?: string;
  label?: React.ReactNode;
}

function Events ({ emptyLabel, eventClassName, events, label }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Table>
      <Table.Head>
        <th className='start'><h1>{label || t('recent events')}</h1></th>
      </Table.Head>
      <Table.Body empty={emptyLabel || t('No events available')}>
        {events
          .filter(({ event: { method, section } }): boolean => !!method && !!section)
          .map((event: EventRecord, index): React.ReactNode => (
            <tr
              className={eventClassName}
              key={`event:${index}`}
            >
              <td className='overflow'>
                <Event value={event} />
              </td>
            </tr>
          ))
        }
      </Table.Body>
    </Table>
  );
}

export default React.memo(Events);
