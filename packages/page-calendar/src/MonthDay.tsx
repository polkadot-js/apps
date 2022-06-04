// Copyright 2017-2022 @polkadot/app-calendar authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EntryInfo } from './types';

import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  dateMonth: Date;
  day: number;
  isCurrent: boolean;
  isDisabled: boolean;
  setDay: (day: number) => void;
  scheduled: EntryInfo[];
}

const DAY_TO_MS = 24 * 60 * 60 * 1000;

function MonthDay ({ className = '', dateMonth, day, isCurrent, isDisabled, scheduled, setDay }: Props): React.ReactElement<Props> {
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
      className={`day${isDisabled ? ' isDisabled' : (isCurrent ? ' highlight--bg-light highlight--color isSelected' : '')} ${className}`}
      onClick={_onClick}
    >
      {day}
      {hasEvents && <div className='eventIndicator highlight--border' />}
    </div>
  );
}

export default React.memo(styled(MonthDay)`
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

  &:not(.isDisabled) {
    cursor: pointer;
  }

  &:not(.isSelected):hover {
    background: #f7f5f3;
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
    opacity: 0.375;

    &:hover {
      background: transparent;
    }

    .eventIndicator {
      display: none;
    }
  }
`);
