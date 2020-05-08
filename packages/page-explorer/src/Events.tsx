// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyedEvent } from './types';

import React, { useMemo } from 'react';
import { Table } from '@polkadot/react-components';

import Event from './Event';
import { useTranslation } from './translate';

interface Props {
  emptyLabel?: React.ReactNode;
  events?: KeyedEvent[];
  eventClassName?: string;
  label?: React.ReactNode;
}

function Events ({ emptyLabel, eventClassName, events, label }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const header = useMemo(() => [
    [label || t('recent events'), 'start']
  ], [label, t]);

  return (
    <Table
      empty={emptyLabel || t('No events available')}
      header={header}
    >
      {events && events
        .filter(({ record: { event: { method, section } } }) => !!method && !!section)
        .map(({ key, record }): React.ReactNode => (
          <tr
            className={eventClassName}
            key={key}
          >
            <td className='overflow'>
              <Event value={record} />
            </td>
          </tr>
        ))
      }
    </Table>
  );
}

export default React.memo(Events);
