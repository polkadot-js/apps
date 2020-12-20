// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EntryInfo } from './types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Button } from '@polkadot/react-components';

import DayItem from './DayItem';

interface Props {
  className?: string;
  scheduled: EntryInfo[];
  setView: (v: boolean) => void;
}

function UpcomingEvents ({ className, scheduled, setView }: Props): React.ReactElement<Props> {
  const sched = useMemo(
    () => scheduled.sort((a, b) => a.dateTime - b.dateTime),
    [scheduled]
  );

  return (
    <div className={className}>
      <h1>
        <div className='highlight--color'>
          <Button
            className='all-events-button'
            icon={'calendar'}
            onClick={() => setView(false)}
          />
          Upcoming Events
        </div>
      </h1>
      <ul className='allEventsWrapper'>
        {sched.map((item, index): React.ReactNode => {
          return (
            <DayItem
              className={'all-events-rows'}
              item={item}
              key={index}
              showAllEvents
            />
          );
        })}
      </ul>
    </div>
  );
}

export default React.memo(styled(UpcomingEvents)`
  flex: 0;
  max-width: max-content;

  .all-events-rows {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .allEventsWrapper {
    padding-inline-start: 10px;
  }
`);
