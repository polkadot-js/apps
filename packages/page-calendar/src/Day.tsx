// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EntryInfo } from './types';

import React, { useMemo, useRef } from 'react';
import styled from 'styled-components';
import { Button } from '@polkadot/react-components';

import DayHour from './DayHour';
import { MONTHS } from './constants';
import { useTranslation } from './translate';

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

const NOOP = () => undefined;

function Day ({ className, date, now, scheduled }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const monthRef = useRef(MONTHS.map((m) => t(m)));

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
      <div className='dayHeader'>
        <Button
          icon='chevron-left'
          isDisabled
          onClick={NOOP}
        />
        <div>{date.getDate()} {monthRef.current[date.getMonth()]} {date.getFullYear()}</div>
        <Button
          icon='chevron-right'
          isDisabled
          onClick={NOOP}
        />
      </div>
      <div className='hoursContainer'>
        {HOURS.map((hour, index): React.ReactNode =>
          <DayHour
            date={date}
            hour={(hour + offset) % 24}
            index={index}
            key={(hour + offset) % 24}
            minutes={(!isToday || index) ? 0 : now.getMinutes()}
            offset={offset}
            scheduled={scheduled}
          />
        )}
      </div>
    </div>
  );
}

export default React.memo(styled(Day)`
  flex: 1;
  margin-right: 1rem;

  .dayHeader {
    align-items: center;
    display: flex;
    font-size: 1.25rem;
    justify-content: space-between;
    padding: 1rem 1.5rem 0;

    .ui--Button {
      opacity: 0;
    }
  }

  .hoursContainer {
    margin-top: 1.25em;
  }
`);
