// Copyright 2017-2022 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import App from '@polkadot/app-tech-comm/App';

export { default as useCounter } from './useCounter';

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
