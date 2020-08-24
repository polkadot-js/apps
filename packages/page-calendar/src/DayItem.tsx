// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EntryInfo } from './types';

import React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  item: EntryInfo;
}

function DayItem ({ className, item: { date, type } }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      {date.toLocaleTimeString().split(':').slice(0, 2).join(':')} {type}
    </div>
  );
}

export default React.memo(styled(DayItem)`
  line-height: 1;
  margin: 0.5rem 0.75rem;
`);
