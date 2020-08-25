// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EntryInfo } from './types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import DayItem from './DayItem';

interface Props {
  className?: string;
  date: Date;
  hour: number;
  index: number;
  minutes: number;
  offset: number;
  scheduled: EntryInfo[];
}

const HR_TO_MS = 60 * 60 * 1000;

function DayHour ({ className, date, hour, index, minutes, offset, scheduled }: Props): React.ReactElement<Props> | null {
  const filtered = useMemo(
    (): EntryInfo[] => {
      const start = date.getTime() + ((offset + index) * HR_TO_MS);
      const end = start + HR_TO_MS;

      return scheduled.filter(({ dateTime }) => dateTime >= start && dateTime < end);
    },
    [date, index, offset, scheduled]
  );

  const style = useMemo(
    () => ({ top: `${100 * (minutes / 60)}%` }),
    [minutes]
  );

  const hourStr = `${` ${hour}`.slice(-2)} ${hour >= 12 ? 'pm' : 'am'}`;

  return (
    <div className={className}>
      <div className='hourLabel'>{hourStr}</div>
      <div className='hourContainer'>
        {filtered.map((item, index): React.ReactNode => (
          <DayItem
            item={item}
            key={index}
          />
        ))}
      </div>
      {(minutes !== -1) && (
        <div
          className='hourMinutes highlight--border'
          style={style}
        />
      )}
    </div>
  );
}

export default React.memo(styled(DayHour)`
  align-items: center;
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
    flex: 1;
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
`);
