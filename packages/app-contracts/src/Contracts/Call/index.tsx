// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CallProps } from './types';

import React from 'react';
import { withApi } from '@polkadot/react-api';

import CallTx from './CallTx';
import CallRpc from './CallRpc';

function Call (props: CallProps): React.ReactElement<CallProps> {
  // if (props.api.rpc.contracts && props.api.rpc.contracts.call) {
  //   return (
  //     <CallRpc {...props} />
  //   );
  // } else {
    return (
      <CallTx {...props} />
    );
  // }
}

export default withApi(Call)
