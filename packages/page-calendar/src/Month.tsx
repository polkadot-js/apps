// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button } from '@polkadot/react-components';

import { DAYS, translateDays, translateMonths, useTranslation } from './translate';
import MonthDay from './MonthDay';

interface Props {
  className?: string;
  now: Date;
  onChange: (date: Date) => void;
}

interface DateState {
  dateMonth: Date;
  dateSelected: Date;
  days: number[];
  startClass: string;
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
  const dateMonth = new Date(_dateMonth);

  dateMonth.setHours(0);
  dateMonth.setMinutes(0);
  dateMonth.setSeconds(0);
  dateMonth.setMilliseconds(0);

  const numDays = nextMonth(dateMonth, 0).getDate();
  const days: number[] = [];

  for (let i = 1; i <= numDays; i++) {
    days.push(i);
  }

  const first = new Date(dateMonth.getTime());

  first.setDate(1);

  return {
    dateMonth,
    dateSelected: new Date(_dateSelected),
    days,
    startClass: `start${DAYS[first.getDay()]}`
  };
}

function Month ({ className, now, onChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ dateMonth, dateSelected, days, startClass }, setDate] = useState(getDateState(now, now));

  const dayOfWeekRef = useRef(translateDays(t));
  const monthRef = useRef(translateMonths(t));

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
              day={day}
              hasEvents={false}
              isCurrent={isCurrYear && isCurrMonth && day === dateSelected.getDate()}
              isDisabled={isNowYear && (isOlderMonth || (isNowMonth && now.getDate() > day))}
              key={day}
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

      .day {
        background-color: transparent;
        border: 1px solid transparent;
        border-radius: 50%;
        line-height: 1;
        padding: 1rem;
        position: relative;
        text-align: center;
        z-index: 1;

        &:before {
          border-radius: 50%;
        }

        &:hover {
          background: #f7f5f3;
        }

        &:not(.isDisabled) {
          cursor: pointer;
        }

        .eventIndicator {
          border: 0.25rem solid transparent;
          border-radius: 50%;
          height: 0.25rem;
          position: absolute;
          right: 0.625rem;
          top: 0.625rem;
          width: 0.25rem;
        }

        &.isDisabled {
          opacity: 0.5;

          &:hover {
            background: transparent;
          }

          .eventIndicator {
            display: none;
          }
        }

        &.isSelected {
          &:hover {
            color: white;
          }
        }
      }
    }

    &.startSu .dateGrid .day:first-child { grid-column: 1 }
    &.startMo .dateGrid .day:first-child { grid-column: 2 }
    &.startTu .dateGrid .day:first-child { grid-column: 3 }
    &.startWe .dateGrid .day:first-child { grid-column: 4 }
    &.startTh .dateGrid .day:first-child { grid-column: 5 }
    &.startFr .dateGrid .day:first-child { grid-column: 6 }
    &.startSa .dateGrid .day:first-child { grid-column: 7 }

    .dayOfWeek {
      margin-top: 1.25em;

      > * {
        font-size: 0.7em;
        font-variant: small-caps;
        font-weight: 500;
        letter-spacing: 0.1em;
        text-align: center;
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
