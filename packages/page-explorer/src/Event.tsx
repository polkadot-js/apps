// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { EventRecord } from '@polkadot/types/interfaces';

import React from 'react';
import { Event as EventDisplay, Expander } from '@polkadot/react-components';

interface Props {
  className?: string;
  value: EventRecord;
}

function Event ({ className = '', value: { event } }: Props): React.ReactElement<Props> {
  return (
    <Expander
      className={className}
      summary={`${event.section}.${event.method}`}
      summaryMeta={event.meta}
    >
      <EventDisplay
        className='details'
        value={event}
      />
    </Expander>
  );
}

export default React.memo(Event);
