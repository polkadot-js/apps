// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyedEvent } from './types';

import React from 'react';
import { Event as EventDisplay, Expander } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  emptyLabel?: React.ReactNode;
  events: KeyedEvent[];
  eventClassName?: string;
  withoutIndex?: boolean;
}

function Events ({ emptyLabel, eventClassName, events, withoutIndex }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

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
            <Expander
              summary={
                event.meta && event.meta.documentation
                  ? event.meta.documentation.join(' ')
                  : 'Details'
              }
            >
              <EventDisplay
                className='details'
                value={event}
              />
            </Expander>
          </article>
        );
      })}
    </>
  );
}

export default React.memo(Events);
