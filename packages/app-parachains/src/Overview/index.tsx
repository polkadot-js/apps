// Copyright 2017-2019 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Columar } from '@polkadot/ui-app';

import Parachains from './Parachains';
import Summary from './Summary';

export default class Overview extends React.PureComponent<{}> {
  public render (): React.ReactNode {
    return (
      <>
        <Summary />
        <Columar>
          <Parachains />
        </Columar>
      </>
    );
  }
}
