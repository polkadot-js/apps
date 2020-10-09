// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { EntryInfo } from './types';

import React, { useMemo, useRef } from 'react';
import styled from 'styled-components';
import { Button } from '@polkadot/react-components';

import DayHour from './DayHour';
import DayTime from './DayTime';
import { MONTHS } from './constants';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  date: Date;
  hasNextDay: boolean;
  now: Date;
  scheduled: EntryInfo[];
  setNextDay: () => void;
  setPrevDay: () => void;
}

const HOURS = ((): number[] => {
  const hours: number[] = [];

  for (let i = 0; i < 24; i++) {
    hours.push(i);
  }

  return hours;
})();

function Day ({ className, date, hasNextDay, now, scheduled, setNextDay, setPrevDay }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const monthRef = useRef(MONTHS.map((m) => t(m)));

  const [isToday, nowHours, nowMinutes] = useMemo(
    () => [
      date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear() && date.getDate() === now.getDate(),
      now.getHours(),
      now.getMinutes()
    ],
    [date, now]
  );

  return (
    <div className={className}>
      <h1>
        <div className='highlight--color'>{date.getDate()} {monthRef.current[date.getMonth()]} {date.getFullYear()} {isToday && <DayTime />}</div>
        <Button.Group>
          <Button
            icon='chevron-left'
            isDisabled={isToday}
            onClick={setPrevDay}
          />
          <Button
            icon='chevron-right'
            isDisabled={!hasNextDay}
            onClick={setNextDay}
          />
        </Button.Group>
      </h1>
      <div className='hoursContainer highlight--bg-faint'>
        {HOURS.map((hour, index): React.ReactNode =>
          <DayHour
            date={date}
            hour={hour}
            index={index}
            key={hour}
            minutes={(isToday && nowHours === index) ? nowMinutes : 0}
            scheduled={scheduled}
          />
        )}
      </div>
    </div>
  );
}

export default React.memo(styled(Day)`
  flex: 1;

  .dayHeader {
    align-items: center;
    display: flex;
    font-size: 1.25rem;
    justify-content: space-between;
    padding: 1rem 1.5rem 0;
  }

  .hoursContainer {
    z-index: 1;
  }
`);
