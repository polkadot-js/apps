// Copyright 2017-2020 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueueProps } from '@polkadot/react-components/Status/types';

import React from 'react';
import { QueueConsumer } from '@polkadot/react-components/Status/Context';

import Results from './Results';
import Selection from './Selection';

function RpcApp (): React.ReactElement {
  return (
    <QueueConsumer>
      {({ queueRpc, txqueue }: QueueProps): React.ReactNode => (
        <>
          <Selection queueRpc={queueRpc} />
          <Results queue={txqueue} />
        </>
      )}
    </QueueConsumer>
  );
}

export default React.memo(RpcApp);
