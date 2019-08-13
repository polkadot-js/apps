// Copyright 2017-2019 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';
import { QueueProps } from '@polkadot/react-components/Status/types';

import React from 'react';
import { QueueConsumer } from '@polkadot/react-components/Status/Context';

import Results from './Results';
import Selection from './Selection';

type Props = BareProps;

export default class RpcApp extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    return (
      <QueueConsumer>
        {({ txqueue, queueRpc }: QueueProps): React.ReactNode => (
          <>
            <Selection queueRpc={queueRpc} />
            <Results queue={txqueue} />
          </>
        )}
      </QueueConsumer>
    );
  }
}
