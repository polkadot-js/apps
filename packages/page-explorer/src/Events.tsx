// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyedEvent } from './types';

import React from 'react';
import { Table } from '@polkadot/react-components';

import Event from './Event';
import { useTranslation } from './translate';

interface Props {
  emptyLabel?: React.ReactNode;
  events: KeyedEvent[];
  eventClassName?: string;
  label?: React.ReactNode;
  withoutIndex?: boolean;
}

function Events ({ emptyLabel, eventClassName, events, label, withoutIndex }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Table>
      <Table.Head>
        <th className='start'><h1>{label || t('recent events')}</h1></th>
      </Table.Head>
      <Table.Body empty={emptyLabel || t('No events available')}>
        {events
          .filter(({ record: { event: { method, section } } }): boolean => !!method && !!section)
          .map((event: KeyedEvent): React.ReactNode => (
            <tr
              className={eventClassName}
              key={event.key}
            >
              <td className='overflow'>
                <Event
                  event={event}
                  withoutIndex={withoutIndex}
                />
              </td>
            </tr>
          ))
        }
      </Table.Body>
    </Table>
  );
}

export default React.memo(Events);
