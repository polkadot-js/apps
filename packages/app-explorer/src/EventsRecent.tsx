// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { EventRecord } from '@polkadot/types';
import { withCall, withMulti } from '@polkadot/ui-api/index';
import { stringToU8a } from '@polkadot/util';
import { xxhashAsHex } from '@polkadot/util-crypto';

import { MAX_ITEMS } from './BlockHeaders';
import Events from './Events';
import translate from './translate';

type Props = I18nProps & {
  system_events?: Array<EventRecord>
};

type State = {
  prevEventHash: string;
  recentEvents: Array<EventRecord>;
};

class EventsRecent extends React.PureComponent<Props, State> {
  state: State = {
    prevEventHash: '',
    recentEvents: []
  };

  static getDerivedStateFromProps ({ system_events = [] }: Props, prevState: State): State | null {
    const prevEventHash = xxhashAsHex(stringToU8a(JSON.stringify(system_events)));

    if (prevEventHash === prevState.prevEventHash) {
      return null;
    }

    const recentEvents = system_events
      .filter(({ event }) => event.section !== 'system')
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

    return (
      <div>
        <Events
          emptyLabel={t('no recent non-system events available')}
          value={recentEvents}
          withoutIndex
        />
      </div>
    );
  }
}

export default withMulti(
  EventsRecent,
  translate,
  withCall('query.system.events')
);
