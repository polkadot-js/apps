// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useApi } from '@polkadot/react-hooks';

import DispatchQueue from './DispatchQueue';
import Scheduler from './Scheduler';

interface Props {
  className?: string;
}

function Execute ({ className }: Props): React.ReactElement<Props> {
  const { api } = useApi();

  return (
    <div className={className}>
      <DispatchQueue />
      {api.query.scheduler && (
        <Scheduler />
      )}
    </div>
  );
}

export default React.memo(Execute);
