// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';

import { AccountId } from '@polkadot/types';
import { BestNumber, Chain, NodeName, NodeVersion } from '@polkadot/ui-react-rx/index';
import { withMulti, withObservable } from '@polkadot/ui-react-rx/with/index';

type Props = BareProps & {
  sessionValidators?: Array<AccountId>
};

const pkgJson = require('../package.json');

class NodeInfo extends React.PureComponent<Props> {
  render () {
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
        <div>polkadot-js-ui&nbsp;v{pkgJson.version}</div>
      </div>
    );
  }
}

// NOTE While these are not used internally to this specific component, we are loading them
// to have them warmed-up globally. This means when accessing in other components, the values
// are already there
export default withMulti(
  NodeInfo,
  withObservable('sessionValidators')
);
