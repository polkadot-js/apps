// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function calcDateInfo (date: Date): [string, number[]] {
  const nextMonth = date.getMonth();
  const numDays = nextMonth === 11
    ? new Date(date.getFullYear() + 1, 0, 0).getDate()
    : new Date(date.getFullYear(), nextMonth + 1, 0).getDate();
  const days: number[] = [];

  for (let i = 1; i <= numDays; i++) {
    days.push(i);
  }

  const first = new Date(date.getTime());

  first.setDate(1);

  return [`start${DAYS[first.getDay()]}`, days];
}

function Month ({ className }: Props): React.ReactElement<Props> {
  const [[startClass, days]] = useState(calcDateInfo(new Date()));

  return (
    <div className={className}>
      <div className={`calendar ${startClass}`}>
        <div className='monthIndicator'>
          <time dateTime='2020-08'>August 2020</time>
        </div>
        <div className='dayOfWeek'>
          <div>Su</div>
          <div>Mo</div>
          <div>Tu</div>
          <div>We</div>
          <div>Th</div>
          <div>Fr</div>
          <div>Sa</div>
        </div>
        <div className='dateGrid'>
          {days.map((day): React.ReactNode => (
            <button key={day}>{day}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default React.memo(styled(Month)`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 3em auto 0 auto;
  max-width: max-content;
  padding: 1.5em;

  .calendar {
    .dateGrid,
    .dayOfWeek {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }

    .dateGrid {
      margin-top: 0.5em;

      button {
        background-color: transparent;
        border: 0;
        border-radius: 50%;
        height: 4.5ch;
        position: relative;
        width: 4.5ch;

        &:hover,
        &:focus {
          outline: none;
        }

        &:active,
        &.isSelected {
          color: red;
        }
      }
    }

    &.startSu .dateGrid button:first-child { grid-column: 1 }
    &.startMo .dateGrid button:first-child { grid-column: 2 }
    &.startTu .dateGrid button:first-child { grid-column: 3 }
    &.startWe .dateGrid button:first-child { grid-column: 4 }
    &.startTh .dateGrid button:first-child { grid-column: 5 }
    &.startFr .dateGrid button:first-child { grid-column: 6 }
    &.startSa .dateGrid button:first-child { grid-column: 7 }

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
      font-weight: 500;
      text-align: center;
    }
  }
`);
