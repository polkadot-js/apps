// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback } from 'react';

interface Props {
  day: number;
  hasEvents: boolean;
  isCurrent: boolean;
  isDisabled: boolean;
  setDay: (day: number) => void;
}

function MonthDay ({ day, hasEvents, isCurrent, isDisabled, setDay }: Props): React.ReactElement<Props> {
  const _onClick = useCallback(
    (): void => {
      !isDisabled && setDay(day);
    },
    [day, isDisabled, setDay]
  );

  return (
    <div
      className={`day${isDisabled ? ' isDisabled' : (isCurrent ? ' highlight--bg-light highlight--border highlight--hover-bg isSelected' : '')}`}
      onClick={_onClick}
    >
      {day}
      {hasEvents && <div className='eventIndicator highlight--border' />}
    </div>
  );
}

export default React.memo(MonthDay);
