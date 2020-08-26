// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
