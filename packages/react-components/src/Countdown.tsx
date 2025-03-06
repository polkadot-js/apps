// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';

interface CountdownProps {
  start: Date;
  current: Date;
  end: Date;
}

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 60 * SECONDS_IN_MINUTE;
const SECONDS_IN_DAY = 24 * SECONDS_IN_HOUR;

const formatTime = (seconds: number) => {
  const days = Math.floor(seconds / SECONDS_IN_DAY);
  const hours = Math.floor((seconds % SECONDS_IN_DAY) / SECONDS_IN_HOUR);
  const minutes = Math.floor((seconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);

  return `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
};

const Countdown: React.FC<CountdownProps> = ({ current, end, start }) => {
  const totalDuration = end.getTime() - start.getTime();
  const timeElapsed = current.getTime() - start.getTime();
  const initialRemainingTime = Math.max(totalDuration - timeElapsed, 0) / 1000;

  const [remainingTime, setRemainingTime] = useState<number>(initialRemainingTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  if (end < start) {
    console.error('End date must be after start date');

    return <></>;
  }

  if (current < start || current > end) {
    console.error('Current date must be between start and end dates');

    return <></>;
  }

  return (
    <div className='text-center text-xl'>
      {remainingTime > 0
        ? (
          <span>{formatTime(remainingTime)}</span>
        )
        : (
          <span>0d 0h 0m</span>
        )}
    </div>
  );
};

export default Countdown;
