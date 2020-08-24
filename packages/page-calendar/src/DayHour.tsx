// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

interface Props {
  hour: number;
  minutes: number;
}

function DayHour ({ hour, minutes }: Props): React.ReactElement<Props> | null {
  const hourStr = `${` ${hour}`.slice(-2)} ${hour >= 12 ? 'pm' : 'am'}`;

  return (
    <div className={`hour${minutes !== -1 ? ' highlight--bg-light' : ''}`}>
      <div className='hourLabel'>{hourStr}</div>
      {(minutes !== -1) && (
        <div
          className='hourMinutes highlight--border'
          style={{ top: `${100 * (minutes / 60)}%` }}
        />
      )}
    </div>
  );
}

export default React.memo(DayHour);
