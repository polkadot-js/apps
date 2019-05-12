// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { EventRecord } from '@polkadot/types';
import { Event as EventDisplay } from '@polkadot/ui-app';
import { formatNumber, stringToU8a } from '@polkadot/util';
import { xxhashAsHex } from '@polkadot/util-crypto';

import translate from './translate';

type Props = I18nProps & {
  emptyLabel?: React.ReactNode,
  events: Array<EventRecord>,

  eventClassName?: string,
  withoutIndex?: boolean
};

class Events extends React.PureComponent<Props> {
  render () {
    const { emptyLabel, events, t } = this.props;

    if (!events || events.length === 0) {
      return emptyLabel || t('no events available');
    }

    return events
      .filter(({ event }) => event) // event.section !== 'system')
      .map(this.renderEvent);
  }

  private renderEvent = (record: EventRecord) => {
    const { eventClassName, withoutIndex } = this.props;
    const { event, phase } = record;
    const extIndex = !withoutIndex && phase.type === 'ApplyExtrinsic'
      ? phase.asApplyExtrinsic
      : -1;

    if (!event.method || !event.section) {
      return null;
    }

    const hash = xxhashAsHex(stringToU8a(JSON.stringify(record)));

    return (
      <div
        className={eventClassName}
        key={hash}
      >
        <article className='explorer--Container'>
          <div className='header'>
            <h3>
              {event.section}.{event.method}&nbsp;{
                extIndex !== -1
                  ? `(#${formatNumber(extIndex)})`
                  : ''
              }
            </h3>
          </div>
          <details>
            <summary>
              {
                event.meta && event.meta.documentation
                  ? event.meta.documentation.join(' ')
                  : 'Details'
              }
            </summary>
            <EventDisplay
              className='details'
              value={event}
            />
          </details>
        </article>
      </div>
    );
  }
}

export default translate(Events);
