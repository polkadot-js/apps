// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';

import isTestChain from '@polkadot/ui-react-rx/util/isTestChain';
import keyring from '@polkadot/ui-keyring/index';
import BestNumber from '@polkadot/ui-react-rx/BestNumber';
import Chain from '@polkadot/ui-react-rx/Chain';
import NodeName from '@polkadot/ui-react-rx/NodeName';
import NodeVersion from '@polkadot/ui-react-rx/NodeVersion';

type Props = BareProps & {};

const pkgJson = require('../package.json');

function updateTestInfo (chain?: string) {
  keyring.setDevMode(isTestChain(chain));
}

export default class NodeInfo extends React.PureComponent<Props> {
  render () {
    return (
      <div className='apps--NodeInfo'>
        <div className='apps--NodeInfo-inline'>
          <Chain rxChange={updateTestInfo} />&nbsp;
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
