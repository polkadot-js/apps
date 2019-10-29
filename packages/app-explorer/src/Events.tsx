// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { KeyedEvent } from './types';

import React from 'react';
import { Event as EventDisplay } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import translate from './translate';

interface Props extends I18nProps {
  emptyLabel?: React.ReactNode;
  events: KeyedEvent[];
  eventClassName?: string;
  withoutIndex?: boolean;
}

function Events ({ emptyLabel, eventClassName, events, withoutIndex, t }: Props): React.ReactElement<Props> {
  if (!events || events.length === 0) {
    return (
      <article>
        {emptyLabel || t('no events available')}
      </article>
    );
  }

  return (
    <>
      {events.map(({ key, record: { event, phase } }: KeyedEvent): React.ReactNode => {
        const extIndex = !withoutIndex && phase.isApplyExtrinsic
          ? phase.asApplyExtrinsic
          : -1;

        if (!event.method || !event.section) {
          return null;
        }

        return (
          <article
            className={`explorer--Container ${eventClassName}`}
            key={key}
          >
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
        );
      })}
    </>
  );
}

export default translate(Events);
