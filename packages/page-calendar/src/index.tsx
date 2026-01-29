// Copyright 2017-2025 @polkadot/app-calendar authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DateState } from './types.js';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { styled, Tabs } from '@polkadot/react-components';

import Day from './Day.js';
import Month from './Month.js';
import { useTranslation } from './translate.js';
import UpcomingEvents from './UpcomingEvents.js';
import useScheduled from './useScheduled.js';
import { getDateState, nextMonth, prevMonth } from './util.js';

interface Props {
  basePath: string;
  className?: string;
}

const NOW_INC = 30 * 1000;

function CalendarApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const scheduled = useScheduled();
  const [now, setNow] = useState(() => new Date());
  const [dateState, setDateState] = useState(() => getDateState(now, now));
  const [allEventsView, setAllEventsView] = useState(false);

  const itemsRef = useRef([{
    isRoot: true,
    name: 'view',
    text: t('Upcoming events')
  }]);

  useEffect((): () => void => {
    const intervalId = setInterval(() => setNow(new Date()), NOW_INC);

    return (): void => {
      clearInterval(intervalId);
    };
  }, []);

  const [hasNextMonth, hasNextDay, lastDay] = useMemo(
    () => {
      const nextDay = new Date(dateState.dateSelected);

      nextDay.setDate(nextDay.getDate() + 1);

      const nextDayTime = nextDay.getTime();
      const nextMonthTime = dateState.dateMonthNext.getTime();
      const hasNextMonth = scheduled.some(({ dateTime }) => dateTime >= nextMonthTime);
      const hasNextDay = hasNextMonth || scheduled.some(({ dateTime }) => dateTime >= nextDayTime);
      const lastDay = hasNextMonth
        ? 42 // more than days in month
        : scheduled.reduce((lastDay: number, { date }): number => {
          return date.getFullYear() === dateState.dateMonth.getFullYear() && date.getMonth() === dateState.dateMonth.getMonth()
            ? Math.max(lastDay, date.getDate())
            : lastDay;
        }, 0);

      return [hasNextMonth, hasNextDay, lastDay];
    },
    [dateState, scheduled]
  );

  const _nextMonth = useCallback(
    () => setDateState(({ dateMonth, dateSelected }) => getDateState(nextMonth(dateMonth), dateSelected)),
    []
  );

  const _prevMonth = useCallback(
    () => setDateState(({ dateMonth, dateSelected }) => getDateState(prevMonth(dateMonth), dateSelected)),
    []
  );

  const _nextDay = useCallback(
    () => setDateState(({ dateSelected }): DateState => {
      const date = new Date(dateSelected);

      date.setDate(date.getDate() + 1);

      return getDateState(date, date);
    }),
    []
  );

  const _prevDay = useCallback(
    () => setDateState(({ dateSelected }): DateState => {
      const date = new Date(dateSelected);

      date.setDate(date.getDate() - 1);

      return getDateState(date, date);
    }),
    []
  );

  const _setDay = useCallback(
    (day: number) => setDateState(({ dateMonth }): DateState => {
      const date = new Date(dateMonth);

      date.setDate(day);

      return getDateState(date, date);
    }),
    []
  );

  const _setAllEventsView = useCallback(
    (v: boolean) => setAllEventsView(v),
    []
  );

  return (
    <StyledMain className={className}>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <div className='calendarFlex'>
        <Month
          hasNextMonth={hasNextMonth}
          lastDay={lastDay}
          now={now}
          scheduled={scheduled}
          setDay={_setDay}
          setNextMonth={_nextMonth}
          setPrevMonth={_prevMonth}
          state={dateState}
        />
        <div className='wrapper-style'>
          {allEventsView
            ? (
              <UpcomingEvents
                className='upcoming-events'
                scheduled={scheduled}
                setView={_setAllEventsView}
              />
            )
            : (
              <Day
                date={dateState.dateSelected}
                hasNextDay={hasNextDay}
                now={now}
                scheduled={scheduled}
                setNextDay={_nextDay}
                setPrevDay={_prevDay}
                setView={_setAllEventsView}
              />
            )
          }
        </div>
      </div>
    </StyledMain>
  );
}

const StyledMain = styled.main`
  .calendarFlex {
    align-items: flex-start;
    display: flex;
    flex-wrap: nowrap;

    .wrapper-style {
      flex: 1;

      .upcoming-events {
        position: relative;
        max-width: 100%;
      }
    }

    > div {
      background-color: var(--bg-table);
      border: 1px solid var(--border-table);
      border-radius: 0.25rem;

      &+div {
        margin-left: 1.5rem;
      }

      .ui--Button-Group {
        margin: 0;
      }
    }

    h1 {
      align-items: center;
      border-bottom: 0.25rem solid var(--bg-page);
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0.5rem 0.5rem 1rem;

      > div:first-child {
        align-items: center;
        display: inline-flex;
      }

      .all-events-button {
        margin-right: 1rem;
      }

      .ui--Button {
        font-size: var(--font-size-small);
      }
    }
  }
`;

export default React.memo(CalendarApp);
