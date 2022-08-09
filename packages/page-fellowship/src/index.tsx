// Copyright 2017-2022 @polkadot/app-fellowship authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Main from '@polkadot/app-ranked/App';

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
      palletColl='fellowshipCollective'
      palletPoll='fellowshipReferenda'
    />
  );
}

export default React.memo(App);
