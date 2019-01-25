// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { EventRecord } from '@polkadot/types';
import { Event as EventDisplay } from '@polkadot/ui-app/index';
import { numberFormat } from '@polkadot/ui-reactive/util/index';

import translate from './translate';

type Props = I18nProps & {
  value?: Array<EventRecord>,
  emptyLabel?: React.ReactNode,
  eventClassName?: string,
  withoutIndex?: boolean
};

class Events extends React.PureComponent<Props> {
  render () {
    const { emptyLabel, eventClassName, value, t } = this.props;

    if (!value || value.length === 0) {
      return emptyLabel || t('no events available');
    }

    return value
      .filter(({ event }) => event) // event.section !== 'system')
      .map((event, index) => {
        const rendered = this.renderEvent(event, index);

        return eventClassName
          ? (
            <div
              className={eventClassName}
              key={index}
            >
              {rendered}
            </div>
          )
          : rendered;
      });
  }

  private renderEvent = ({ event, phase }: EventRecord, index: number) => {
    const { withoutIndex } = this.props;
    const extIndex = !withoutIndex && phase.type === 'ApplyExtrinsic'
      ? phase.asApplyExtrinsic
      : -1;

    return (
      <article
        className={['explorer--Container', 'ui--hoverable'].join(' ')}
        key={index}
      >
        <div className='header'>
          <h3>
            {event.section}.{event.method}&nbsp;{
              extIndex !== -1
                ? `(#${numberFormat(extIndex)})`
                : ''
            }
          </h3>

        </div>
        <div className='ui--hover'>
          <div className='ui--hover-content'>
            <div className='description'>
              {
                event.meta.documentation && event.meta.documentation.length
                  ? event.meta.documentation.map((doc) => doc.toString()).join(' ')
                  : ''
              }
            </div>
            <EventDisplay
              className='details'
              value={event}
            />
          </div>
        </div>
      </article>
    );
  }
}

export default translate(Events);
