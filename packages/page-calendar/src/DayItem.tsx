// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EntryInfo } from './types';

import React from 'react';

interface Props {
  item: EntryInfo;
}

function DayItem ({ item: { date, type } }: Props): React.ReactElement<Props> {
  return (
    <div className='hourDayItem'>
      {date.toTimeString()} {type}
    </div>
  );
}

export default React.memo(DayItem);
