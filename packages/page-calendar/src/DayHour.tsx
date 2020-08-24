// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EntryInfo } from './types';

import React, { useMemo } from 'react';

import DayItem from './DayItem';

interface Props {
  date: Date;
  hour: number;
  minutes: number;
  scheduled: EntryInfo[];
}

const HR_TO_MS = 60 * 60 * 1000;

function DayHour ({ date, hour, minutes, scheduled }: Props): React.ReactElement<Props> | null {
  const filtered = useMemo(
    (): EntryInfo[] => {
      const start = date.getTime() + ((hour + 1) * HR_TO_MS);
      const end = start + HR_TO_MS;

      return scheduled.filter(({ dateTime }) => dateTime >= start && dateTime < end);
    },
    [date, hour, scheduled]
  );

  const style = useMemo(
    () => ({ top: `${100 * (minutes / 60)}%` }),
    [minutes]
  );

  const hourStr = `${` ${hour}`.slice(-2)} ${hour >= 12 ? 'pm' : 'am'}`;

  return (
    <div className='hour'>
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

export default React.memo(DayHour);
