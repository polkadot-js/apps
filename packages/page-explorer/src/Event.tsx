// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EventRecord } from '@polkadot/types/interfaces';

import React from 'react';

import { Expander } from '@polkadot/react-components';
import { Event as EventDisplay } from '@polkadot/react-params';

interface Props {
  className?: string;
  value: EventRecord;
}

function Event ({ className = '', value: { event } }: Props): React.ReactElement<Props> {
  const eventName = `${event.section}.${event.method}`;

  return (
    <Expander
      className={className}
      isLeft
      summary={eventName}
      summaryMeta={event.meta}
    >
      {event.data.length
        ? (
          <EventDisplay
            className='details'
            eventName={eventName}
            value={event}
            withExpander
          />
        )
        : null
      }
    </Expander>
  );
}

export default React.memo(Event);
