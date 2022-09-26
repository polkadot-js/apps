// Copyright 2017-2022 @polkadot/app-supersig authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { useApi } from '@polkadot/react-hooks';
import Scheduler from './Scheduler';

interface Props {
  className?: string;
}

function Execute ({ className }: Props): React.ReactElement<Props> {
  const { api } = useApi();

  return (
    <div className={className}>
      {api.query.scheduler && (
        <Scheduler />
      )}
    </div>
  );
}

export default React.memo(Execute);
