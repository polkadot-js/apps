// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { KeyedEvent } from './types';

import React from 'react';
import { Event as EventDisplay } from '@polkadot/ui-app';
import { formatNumber } from '@polkadot/util';

import translate from './translate';

type Props = I18nProps & {
  emptyLabel?: React.ReactNode,
  events: Array<KeyedEvent>,
  eventClassName?: string,
  withoutIndex?: boolean
};

class Events extends React.PureComponent<Props> {
  render () {
    const { emptyLabel, events, t } = this.props;

    if (!events || events.length === 0) {
      return emptyLabel || t('no events available');
    }

    return events.map(this.renderEvent);
  }

  private renderEvent = ({ key, record: { event, phase } }: KeyedEvent) => {
    const { eventClassName, withoutIndex } = this.props;
    const extIndex = !withoutIndex && phase.type === 'ApplyExtrinsic'
      ? phase.asApplyExtrinsic
      : -1;

    if (!event.method || !event.section) {
      return null;
    }

    return (
      <div
        className={eventClassName}
        key={key}
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
