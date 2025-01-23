// Copyright 2017-2025 @polkadot/app-calendar authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EntryInfoTyped } from './types.js';

import React, { useMemo } from 'react';

import { styled } from '@polkadot/react-components';

import DayItem from './DayItem.js';

interface Props {
  className?: string;
  date: Date;
  hour: number;
  index: number;
  minutes: number;
  scheduled: EntryInfoTyped[];
}

const MN_TO_MS = 60 * 1000;
const HR_TO_MS = 60 * MN_TO_MS;

function filterEntries (date: Date, minutes: number, index: number, scheduled: EntryInfoTyped[]): EntryInfoTyped[] {
  const start = date.getTime() + (index * HR_TO_MS);
  const end = start + HR_TO_MS;
  const explicit = start + (minutes * MN_TO_MS);

  return scheduled
    .filter(({ dateTime }) => dateTime >= explicit && dateTime < end)
    .sort((a, b) => (a.dateTime - b.dateTime) || a.type.localeCompare(b.type));
}

function DayHour ({ className = '', date, hour, index, minutes, scheduled }: Props): React.ReactElement<Props> | null {
  const filtered = useMemo(
    () => filterEntries(date, minutes, index, scheduled),
    [date, index, minutes, scheduled]
  );

  const hourStr = `${` ${hour}`.slice(-2)} ${hour >= 12 ? 'pm' : 'am'}`;

  return (
    <StyledDiv className={`${className}${filtered.length ? ' hasItems' : ''}`}>
      <div className={`hourLabel${filtered.length ? ' highlight--color' : ''}`}>{hourStr}</div>
      <div className='hourContainer'>
        {filtered.map((item, index): React.ReactNode => (
          <DayItem
            item={item}
            key={index}
          />
        ))}
      </div>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  align-items: center;
  display: flex;
  position: relative;
  z-index: 2;

  &:nth-child(odd) {
    background: var(--bg-table);
  }

  &.isPast {
    opacity: 0.75;
  }

  .hourContainer {
    flex: 1;
    padding: 0.25rem 0;
  }

  .hourLabel {
    flex: 0;
    font-size: var(--font-size-small);
    font-weight: var(--font-weight-normal);
    line-height: 1;
    min-width: 5.5rem;
    opacity: var(--opacity-light);
    padding: 0.5rem 1rem;
    text-align: right;
    text-transform: uppercase;
    z-index: 1;
  }

  &.hasItems .hourLabel {
    font-size: 1.1rem;
    font-weight: var(--font-weight-normal);
    opacity: 1;
    padding: 0.7rem 1rem;
  }
`;

export default React.memo(DayHour);
