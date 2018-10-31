// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Event, EventRecord } from '@polkadot/types';
import withObservable from '@polkadot/ui-react-rx/with/observable';
import withMulti from '@polkadot/ui-react-rx/with/multi';

import { MAX_ITEMS } from './BlockHeaders';
import translate from './translate';

type Props = I18nProps & {
  systemEvents?: Array<EventRecord>
};

type State = {
  recentEvents: Array<Event>;
};

class Events extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      recentEvents: []
    };
  }

  static getDerivedStateFromProps ({ systemEvents = [] }: Props, prevState: State): State {
    const recentEvents = systemEvents
      .filter(({ event }) =>
        event.index.toHex() !== '0x0000'
      )
      .map(({ event }) =>
        event
      )
      .concat(prevState.recentEvents)
      .filter((_, index) =>
          index < MAX_ITEMS
        );

    return {
      recentEvents
    };
  }

  render () {
    const { t } = this.props;
    const { recentEvents } = this.state;

    if (recentEvents.length === 0) {
      return (
        <div>{t('events.none', {
          defaultValue: 'no non-internal events available'
        })}</div>
      );
    }

    return (
      <pre>{JSON.stringify(recentEvents, null, 2)}</pre>
    );
  }
}

export default withMulti(
  translate(Events),
  withObservable('systemEvents')
);
