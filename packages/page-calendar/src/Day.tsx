// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EntryInfo } from './types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import DayHour from './DayHour';

interface Props {
  className?: string;
  date: Date;
  now: Date;
  scheduled: EntryInfo[];
}

const HOURS = ((): number[] => {
  const hours: number[] = [];

  for (let i = 0; i < 24; i++) {
    hours.push(i);
  }

  return hours;
})();

function Day ({ className, date, now, scheduled }: Props): React.ReactElement<Props> {
  const [isToday, nowOffset] = useMemo(
    () => [
      date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear(),
      now.getHours()
    ],
    [date, now]
  );

  const offset = isToday
    ? nowOffset
    : 0;

  return (
    <div className={className}>
      {HOURS.map((hour, index): React.ReactNode =>
        <DayHour
          date={date}
          hour={(hour + offset) % 24}
          key={(hour + offset) % 24}
          minutes={(!isToday || index) ? -1 : now.getMinutes()}
          scheduled={scheduled}
        />
      )}
    </div>
  );
}

export default React.memo(styled(Day)`
  flex: 1;
  margin-right: 1rem;

  .hour {
    align-items: flex-start;
    display: flex;
    position: relative;
    z-index: 2;

    &:nth-child(even) {
      background: #faf8f6;
    }

    &:nth-child(odd) {
      background: white;
    }

    &.isPast {
      opacity: 0.75;
    }

    .hourContainer {
      padding: 0.5rem;

      .hourDayItem {
        padding: 0.5rem 0.75rem;

        &+.hourDayItem {
          margin-top: 0.5rem;
        }
      }
    }

    .hourLabel {
      flex: 0;
      font-size: 0.9rem;
      font-weight: 100;
      line-height: 1;
      min-width: 5.5rem;
      opacity: 0.75;
      padding: 0.5rem 1rem;
      text-align: right;
      text-transform: uppercase;
      z-index: 1;
    }

    .hourMinutes {
      border: 1px solid transparent;
      left: 0;
      opacity: 0.25;
      position: absolute;
      right: 0;
      z-index: 0;
    }
  }
`);
