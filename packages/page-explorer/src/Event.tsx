// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyedEvent } from './types';

import React from 'react';
import { Event as EventDisplay, Expander } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

interface Props {
  event: KeyedEvent;
  withoutIndex?: boolean;
}

function Event ({ event: { record: { event, phase } }, withoutIndex }: Props): React.ReactElement<Props> {
  return (
    <Expander
      summary={`${event.section}.${event.method} ${
        !withoutIndex && phase.isApplyExtrinsic
          ? `(#${formatNumber(phase.asApplyExtrinsic)})`
          : ''
      }`}
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
