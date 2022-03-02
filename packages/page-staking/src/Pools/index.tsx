// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Summary from './Summary';

interface Props {
  className?: string;
}

function Pools ({ className }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <Summary />
    </div>
  );
}

export default React.memo(Pools);
