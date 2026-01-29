// Copyright 2017-2025 @polkadot/app-membership authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import App from '@polkadot/app-tech-comm/App';

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
      type='membership'
    />
  );
}

export default React.memo(TechComm);
