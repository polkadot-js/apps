// Copyright 2017-2023 @polkadot/app-ranked authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Main from './App';

export { default as useCounter } from './useCounter';

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
