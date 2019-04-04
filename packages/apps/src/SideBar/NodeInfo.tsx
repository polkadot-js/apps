// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import styled from 'styled-components';
import { withApi } from '@polkadot/ui-api/with';
import { BestNumber, Chain, NodeName, NodeVersion } from '@polkadot/ui-reactive';

type Props = ApiProps & BareProps & {};

const Wrapper = styled.div`
  background: transparent;
  color: white;
  font-size: 0.75rem;
  opacity: 0.5;
  padding: 0 1.5rem 0 1.5rem;
  text-align: right;

  > div {
    margin-bottom: -0.125em;
    > div {
      display: inline-block;
    }

    &.spacer {
      margin-bottom: 0.5rem;
    }
  }

  .rx--updated {
    background: inherit !important;
  }
`;

const HEALTH_POLL = 22500;
const pkgJson = require('../../package.json');

class NodeInfo extends React.PureComponent<Props> {
  componentDidMount () {
    const { api } = this.props;

    window.setInterval(() => {
      api.rpc.system
        .health()
        .catch(() => {
          // ignore
        });
    }, HEALTH_POLL);
  }

  render () {
    const { api } = this.props;
    const uiInfo = `apps v${pkgJson.version}`;

    return (
      <Wrapper>
        <div>
          <Chain />&nbsp;
          <BestNumber label='#' />
        </div>
        <div>
          <NodeName />&nbsp;
          <NodeVersion label='v' />
        </div>
        <div className='spacer' />
        <div>{api.libraryInfo.replace('@polkadot/', '')}</div>
        <div>{uiInfo}</div>
      </Wrapper>
    );
  }
}

export default withApi(NodeInfo);
