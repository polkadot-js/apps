// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Event, EventRecord } from '@polkadot/types';
import { Event as EventDisplay } from '@polkadot/ui-app/index';
import { withCall, withMulti } from '@polkadot/ui-api/index';
import { stringToU8a } from '@polkadot/util';
import { xxhashAsHex } from '@polkadot/util-crypto';

import { MAX_ITEMS } from './BlockHeaders';
import translate from './translate';

type Props = I18nProps & {
  query_system_events?: Array<EventRecord>
};

type State = {
  prevEventHash: string;
  recentEvents: Array<Event>;
};

class EventsDisplay extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      prevEventHash: '',
      recentEvents: []
    };
  }

  static getDerivedStateFromProps ({ query_system_events = [] }: Props, prevState: State): State | null {
    const prevEventHash = xxhashAsHex(stringToU8a(JSON.stringify(query_system_events)));

    if (prevEventHash === prevState.prevEventHash) {
      return null;
    }

    const recentEvents = query_system_events
      .filter(({ event }) => event.section !== 'system')
      .map(({ event }) => event)
      .concat(prevState.recentEvents)
      .filter((_, index) => index < MAX_ITEMS);

    return {
      prevEventHash,
      recentEvents
    };
  }

  render () {
    const { t } = this.props;
    const { recentEvents } = this.state;

    if (recentEvents.length === 0) {
      return (
        <div>{t('events.none', {
          defaultValue: 'no non-system events available'
        })}</div>
      );
    }

    return (
      <div>
        {recentEvents.map(this.renderEvent)}
      </div>
    );
  }

  private renderEvent = (event: Event, index: number) => {
    return (
      <article
        className='explorer--Container'
        key={index}
      >
        <div className='header'>
          <h3>
            {event.section}.{event.method}
          </h3>
          <div className='description'>
            {
              event.meta.documentation && event.meta.documentation.length
                ? event.meta.documentation.map((doc) => doc.toString()).join(' ')
                : ''
            }
          </div>
        </div>
        <EventDisplay value={event} />
      </article>
    );
  }
}

export default withMulti(
  EventsDisplay,
  translate,
  withCall('query.system.events')
);
