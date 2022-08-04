// Copyright 2017-2022 @polkadot/app-ranked authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Main from './App';
import useCounter from './useCounter';

export { default as useCounter } from './useCounter';

interface Props {
  basePath: string;
  className?: string;
}

function App ({ basePath, className }: Props): React.ReactElement<Props> {
  const refCount = useCounter();

  return (
    <Main
      basePath={basePath}
      className={className}
      palletColl='rankedCollective'
      palletPoll='rankedPolls'
      refCount={refCount}
    />
  );
}

export default React.memo(App);
