// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { SummaryBox } from '@polkadot/react-components';

interface Props {
  className?: string;
  count: number;
}

function Summary ({ className }: Props): React.ReactElement<Props> {
  return (
    <SummaryBox className={className}>
      Nothing yet...
    </SummaryBox>
  );
}

export default React.memo(Summary);
