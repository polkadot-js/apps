// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Labelled } from '@polkadot/ui-app/index';
import RxNonce from '@polkadot/ui-reactive/Nonce';

type Props = BareProps & {
  callOnResult: (value: BN) => void,
  label: string,
  value?: string
};

export default class Nonce extends React.PureComponent<Props> {
  render () {
    const { label, callOnResult, value } = this.props;

    if (!value) {
      return null;
    }

    return (
      <div className='ui--row'>
        <Labelled
          className='small'
          label={label}
        >
          <RxNonce
            className='ui disabled dropdown selection'
            callOnResult={callOnResult}
            params={value}
          />
        </Labelled>
      </div>
    );
  }
}
