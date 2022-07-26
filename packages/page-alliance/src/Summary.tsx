// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { SummaryBox } from '@polkadot/react-components';

interface Props {
  className?: string;
}

function Summary ({ className }: Props): React.ReactElement<Props> {
  return (
    <SummaryBox className={className} />
  );
}

export default React.memo(Summary);
