// Copyright 2017-2025 @polkadot/app-rpc authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { useQueue } from '@polkadot/react-hooks';

import Results from './Results.js';
import Selection from './Selection.js';

function RpcApp (): React.ReactElement {
  const { queueRpc, txqueue } = useQueue();

  return (
    <>
      <Selection queueRpc={queueRpc} />
      <Results queue={txqueue} />
    </>
  );
}

export default React.memo(RpcApp);
