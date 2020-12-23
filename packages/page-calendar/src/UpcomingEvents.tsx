// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '@polkadot/react-components/types';
import type { EntryInfo } from './types';

import React, { useCallback, useMemo } from 'react';
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

  const viewSetter = useCallback(() => (
    <Button
      className='all-events-button'
      icon={'calendar'}
      onClick={() => setView(false)}
    />
  ), [setView]);

  return (
    <div className={className}>
      <h1>
        <div className='highlight--color'>
          {viewSetter()}
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

export default React.memo(styled(UpcomingEvents)(({ theme }: ThemeProps) => `
  flex: 0;
  max-width: max-content;

  .all-events-rows {
    padding: 10px 0;
    font-size: 13px;
    &:nth-child(odd) {
      background: ${theme.bgTable};
    }
  }

  .allEventsWrapper {
    padding-inline-start: 10px;
  }
`));
