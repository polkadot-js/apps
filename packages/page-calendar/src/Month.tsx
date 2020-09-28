// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DateState, EntryInfo } from './types';

import React, { useMemo, useRef } from 'react';
import styled from 'styled-components';
import { Button } from '@polkadot/react-components';

import { DAYS, MONTHS } from './constants';
import { useTranslation } from './translate';
import MonthDay from './MonthDay';

interface Props {
  className?: string;
  hasNextMonth: boolean;
  lastDay: number;
  now: Date;
  scheduled: EntryInfo[];
  setDay: (day: number) => void;
  setNextMonth: () => void;
  setPrevMonth: () => void;
  state: DateState;
}

function Month ({ className, hasNextMonth, lastDay, now, scheduled, setDay, setNextMonth, setPrevMonth, state: { dateMonth, dateSelected, days, startClass } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const dayOfWeekRef = useRef(DAYS.map((d) => t(d)));
  const monthRef = useRef(MONTHS.map((m) => t(m)));

  const [isCurrYear, isCurrMonth, isNowYear, isNowMonth, isOlderMonth] = useMemo(
    () => [
      dateMonth.getFullYear() === dateSelected.getFullYear(),
      dateMonth.getMonth() === dateSelected.getMonth(),
      now.getFullYear() === dateMonth.getFullYear(),
      now.getMonth() === dateMonth.getMonth(),
      now.getMonth() > dateMonth.getMonth()
    ],
    [dateMonth, dateSelected, now]
  );

  return (
    <div className={className}>
      <h1>
        <div className='highlight--color'>{monthRef.current[dateMonth.getMonth()]} {dateMonth.getFullYear()}</div>
        <Button.Group>
          <Button
            icon='chevron-left'
            isDisabled={isNowYear && (isOlderMonth || isNowMonth)}
            onClick={setPrevMonth}
          />
          <Button
            icon='chevron-right'
            isDisabled={!hasNextMonth}
            onClick={setNextMonth}
          />
        </Button.Group>
      </h1>
      <div className={`calendar ${startClass}`}>
        <div className='dayOfWeek'>
          {dayOfWeekRef.current.map((day): React.ReactNode => (
            <div key={day}>{t(day)}</div>
          ))}
        </div>
        <div className='dateGrid'>
          {days.map((day): React.ReactNode => (
            <MonthDay
              dateMonth={dateMonth}
              day={day}
              isCurrent={isCurrYear && isCurrMonth && day === dateSelected.getDate()}
              isDisabled={(isNowYear && (isOlderMonth || (isNowMonth && now.getDate() > day))) || (!hasNextMonth && day > lastDay)}
              key={day}
              scheduled={scheduled}
              setDay={setDay}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default React.memo(styled(Month)`
  flex: 0;
  max-width: max-content;

  .calendar {
    padding: 1rem 1.5rem;

    .dateGrid,
    .dayOfWeek {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }

    .dateGrid {
      margin-top: 0.5em;
    }

    &.startSun .dateGrid .day:first-child { grid-column: 1 }
    &.startMon .dateGrid .day:first-child { grid-column: 2 }
    &.startTue .dateGrid .day:first-child { grid-column: 3 }
    &.startWed .dateGrid .day:first-child { grid-column: 4 }
    &.startThu .dateGrid .day:first-child { grid-column: 5 }
    &.startFri .dateGrid .day:first-child { grid-column: 6 }
    &.startSat .dateGrid .day:first-child { grid-column: 7 }

    .dayOfWeek {
      > * {
        font-size: 0.7em;
        font-weight: 500;
        letter-spacing: 0.1em;
        text-align: center;
        text-transform: uppercase;
      }
    }

    .monthIndicator {
      align-items: center;
      display: flex;
      font-size: 1.25rem;
      justify-content: space-between;
    }
  }
`);
