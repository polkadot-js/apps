// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyedEvent } from './types';

import React from 'react';
import { Event as EventDisplay, Expander, Table } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

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
          .map(({ key, record: { event, phase } }: KeyedEvent): React.ReactNode => (
            <tr
              className={eventClassName}
              key={key}
            >
              <td className='overflow'>
                <div>{event.section}.{event.method}&nbsp;{
                  !withoutIndex && phase.isApplyExtrinsic
                    ? `(#${formatNumber(phase.asApplyExtrinsic)})`
                    : ''
                }</div>
                <Expander summaryMeta={event.meta}>
                  <EventDisplay
                    className='details'
                    value={event}
                  />
                </Expander>
              </td>
            </tr>
          ))
        }
      </Table.Body>
    </Table>
  );
}

export default React.memo(Events);
