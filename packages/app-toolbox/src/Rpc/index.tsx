// Copyright 2017-2019 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { QueueProps } from '@polkadot/ui-app/Status/types';

import React from 'react';
import { QueueConsumer } from '@polkadot/ui-app/Status/Context';

import Results from './Results';
import Selection from './Selection';

type Props = BareProps;

export default class RpcApp extends React.PureComponent<Props> {
  render () {
    return (
      <QueueConsumer>
        {({ txqueue, queueRpc }: QueueProps) => (
          <>
            <Selection queueRpc={queueRpc} />
            <Results queue={txqueue} />
          </>
        )}
      </QueueConsumer>
    );
  }
}
