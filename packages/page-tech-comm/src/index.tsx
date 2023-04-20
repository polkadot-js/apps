// Copyright 2017-2023 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import App from './App.js';

export { default as useCounter } from './useCounter.js';

interface Props {
  basePath: string;
  className?: string;
}

function TechComm ({ basePath, className }: Props): React.ReactElement<Props> {
  return (
    <App
      basePath={basePath}
      className={className}
      type='technicalCommittee'
    />
  );
}

export default React.memo(TechComm);
