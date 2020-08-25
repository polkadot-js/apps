// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EntryInfo } from './types';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button } from '@polkadot/react-components';

import { DAYS, MONTHS } from './constants';
import { useTranslation } from './translate';
import MonthDay from './MonthDay';

interface Props {
  className?: string;
  now: Date;
  onChange: (date: Date) => void;
  scheduled: EntryInfo[];
}

interface DateState {
  dateMonth: Date;
  dateMonthNext: Date;
  dateSelected: Date;
  days: number[];
  startClass: string;
}

function newZeroDate (input: Date): Date {
  const date = new Date(input);

  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}

function nextMonth (date: Date, firstDay = 1): Date {
  const currMonth = date.getMonth();

  return currMonth === 11
    ? new Date(date.getFullYear() + 1, 0, firstDay)
    : new Date(date.getFullYear(), currMonth + 1, firstDay);
}

function prevMonth (date: Date): Date {
  const currMonth = date.getMonth();

  return currMonth === 0
    ? new Date(date.getFullYear() - 1, 11, 1)
    : new Date(date.getFullYear(), currMonth - 1, 1);
}

function getDateState (_dateMonth: Date, _dateSelected: Date): DateState {
  const dateMonth = newZeroDate(_dateMonth);

  dateMonth.setDate(1);

  const dateMonthNext = nextMonth(dateMonth);
  const dateSelected = newZeroDate(_dateSelected);
  const numDays = nextMonth(dateMonth, 0).getDate();
  const days: number[] = [];

  for (let i = 1; i <= numDays; i++) {
    days.push(i);
  }

  return {
    dateMonth,
    dateMonthNext,
    dateSelected,
    days,
    startClass: `start${DAYS[dateMonth.getDay()]}`
  };
}

function Month ({ className, now, onChange, scheduled }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ dateMonth, dateMonthNext, dateSelected, days, startClass }, setDate] = useState(getDateState(now, now));

  const dayOfWeekRef = useRef(DAYS.map((d) => t(d)));
  const monthRef = useRef(MONTHS.map((m) => t(m)));

  const hasNextMonth = useMemo(
    (): boolean => {
      const nextTime = dateMonthNext.getTime();

      return scheduled.some(({ dateTime }) => dateTime >= nextTime);
    },
    [dateMonthNext, scheduled]
  );

  const _nextMonth = useCallback(
    () => setDate(({ dateMonth, dateSelected }) => getDateState(nextMonth(dateMonth), dateSelected)),
    []
  );

  const _prevMonth = useCallback(
    () => setDate(({ dateMonth, dateSelected }) => getDateState(prevMonth(dateMonth), dateSelected)),
    []
  );

  const _setDay = useCallback(
    (day: number) => setDate(({ dateMonth }): DateState => {
      const date = new Date(dateMonth);

      date.setDate(day);

      return getDateState(date, date);
    }),
    []
  );

  useEffect((): void => {
    onChange(dateSelected);
  }, [dateSelected, onChange]);

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
      <div className={`calendar ${startClass}`}>
        <div className='monthIndicator'>
          <Button
            icon='chevron-left'
            isDisabled={isNowYear && (isOlderMonth || isNowMonth)}
            onClick={_prevMonth}
          />
          <div>{monthRef.current[dateMonth.getMonth()]} {dateMonth.getFullYear()}</div>
          <Button
            icon='chevron-right'
            isDisabled={!hasNextMonth}
            onClick={_nextMonth}
          />
        </div>
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
              isDisabled={isNowYear && (isOlderMonth || (isNowMonth && now.getDate() > day))}
              key={day}
              scheduled={scheduled}
              setDay={_setDay}
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
  padding: 1rem 1.5rem;

  .calendar {
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
      margin-top: 1.25em;

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
