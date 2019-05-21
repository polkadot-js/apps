// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// Unused atm, experiment as a replacement for NodeInfo on the SideBar

import React from 'react';

import { BestNumber, Chain, NodeName, NodeVersion } from '@polkadot/ui-reactive';

import { TopBar as Wrapper } from './styles';

type Props = {};

export default class TopBar extends React.PureComponent<Props> {
  render () {
    return (
      <Wrapper>
        <div>
          <NodeName />&nbsp;
          <NodeVersion label='v' />
        </div>
        <div>
          <Chain />&nbsp;
          <BestNumber label='#' />
        </div>
      </Wrapper>
    );
  }
}
