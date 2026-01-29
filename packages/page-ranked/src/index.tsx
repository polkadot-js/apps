// Copyright 2017-2025 @polkadot/app-ranked authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Main from './App.js';

export { default as useCounter } from './useCounter.js';

interface Props {
  basePath: string;
  className?: string;
}

function App ({ basePath, className }: Props): React.ReactElement<Props> {
  return (
    <Main
      basePath={basePath}
      className={className}
      palletColl='rankedCollective'
      palletPoll='rankedPolls'
    />
  );
}

export default React.memo(App);
