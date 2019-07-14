// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import Members from './Members';
import Summary from './Summary';

interface Props {}

export default class Overview extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    return (
      <>
        <Summary />
        <Members />
      </>
    );
  }
}
