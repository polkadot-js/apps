// Copyright 2017-2020 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useContext } from 'react';
import { StatusContext } from '@polkadot/react-components';

import Results from './Results';
import Selection from './Selection';

function RpcApp (): React.ReactElement {
  const { queueRpc, txqueue } = useContext(StatusContext);

  return (
    <>
      <Selection queueRpc={queueRpc} />
      <Results queue={txqueue} />
    </>
  );
}

export default React.memo(RpcApp);
