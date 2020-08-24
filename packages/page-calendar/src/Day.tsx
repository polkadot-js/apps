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
          offset={offset ? (offset + 1) : 0}
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

  }
`);
