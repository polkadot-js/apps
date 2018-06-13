// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import mockProvider from '@polkadot/api-provider/mock';

import Api from './Api';
import Balance from './Balance';
import BestNumber from './BestNumber';
import Chain from './Chain';
import Connected from './Connected';
import NodeName from './NodeName';
import NodeTime from './NodeTime';
import NodeVersion from './NodeVersion';
import Nonce from './Nonce';
import withApi from './with/api';

const provider = mockProvider();

const ALICE_ADDR = '5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ';
const ALICE_PUBLIC = '0xd172a74cda4c865912c32ba0a80a57ae69abae410e5ccb59dee84e2f4432db4f';

const element = document.getElementById('demo');

if (!element) {
  throw new Error('Unable to find #demo element');
}

const WithApiDebug = withApi(
  (apiProps) => (
    <pre style={{ background: '#f5f5f5', padding: '0.5em' }}>
      {JSON.stringify(apiProps, undefined, 2)}
    </pre>
  )
);

ReactDOM.render(
  <Api provider={provider}>
    <Connected label='status =' />
    <NodeName label='name =' />
    <NodeVersion label='version =' />
    <Chain label='chain =' />
    <br />
    <BestNumber label='best block #' />
    <Balance label='balance =' params={[ALICE_PUBLIC]} />
    <Nonce label='nonce =' params={ALICE_ADDR} />
    <NodeTime label='node time =' />
    <br />
    <WithApiDebug />
  </Api>,
  element
);
