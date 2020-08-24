// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EntryInfo } from './types';

import React, { useCallback, useMemo } from 'react';

interface Props {
  dateMonth: Date;
  day: number;
  isCurrent: boolean;
  isDisabled: boolean;
  setDay: (day: number) => void;
  scheduled: EntryInfo[];
}

const DAY_TO_MS = 24 * 60 * 60 * 1000;

function MonthDay ({ dateMonth, day, isCurrent, isDisabled, scheduled, setDay }: Props): React.ReactElement<Props> {
  const hasEvents = useMemo(
    (): boolean => {
      const start = dateMonth.getTime() + ((day - 1) * DAY_TO_MS);
      const end = start + DAY_TO_MS;

      return scheduled.some(({ dateTime }) => dateTime >= start && dateTime < end);
    },
    [dateMonth, day, scheduled]
  );

  const _onClick = useCallback(
    (): void => {
      !isDisabled && setDay(day);
    },
    [day, isDisabled, setDay]
  );

  return (
    <div
      className={`day${isDisabled ? ' isDisabled' : (isCurrent ? ' highlight--bg-light highlight--color isSelected' : '')}`}
      onClick={_onClick}
    >
      {day}
      {hasEvents && <div className='eventIndicator highlight--border' />}
    </div>
  );
}

export default React.memo(MonthDay);
