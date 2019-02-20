// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';

import { withApi } from '@polkadot/ui-api/with';
import { BestNumber, Chain, NodeName, NodeVersion } from '@polkadot/ui-reactive/index';

type Props = ApiProps & BareProps & {};

const HEALTH_POLL = 22500;
const pkgJson = require('../package.json');

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
    const uiInfo = `@polkadot/apps v${pkgJson.version}`;

    return (
      <div className='apps--NodeInfo'>
        <div className='apps--NodeInfo-inline'>
          <Chain />&nbsp;
          <BestNumber label='#' />
        </div>
        <div className='apps--NodeInfo-inline'>
          <NodeName />&nbsp;
          <NodeVersion label='v' />
        </div>
        <div className='spacer' />
        <div>{api.libraryInfo}</div>
        <div>{uiInfo}</div>
      </div>
    );
  }
}

export default withApi(NodeInfo);
