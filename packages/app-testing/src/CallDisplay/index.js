// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '@polkadot/portal/types';

import './CallDisplay.css';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';
import withObservable from '@polkadot/rx-react/with/observable';

import StakingTransfer from '../StakingTransfer';
import encode from '../encode';
import extrinsics from '../extrinsics';
import keyring from '../keyring';
import { extrinsicName, senderAddr, senderIndex } from '../subjects';
import ErrorComponent from './Error';

type Props = BaseProps & {
  value?: string;
};

const COMPONENTS = {
  'staking_transfer': StakingTransfer
};

function CallDisplay ({ className, style, value }: Props) {
  if (!value) {
    return null;
  }

  const Component = COMPONENTS[value] || ErrorComponent;
  const onSubmit = () => {
    const extrinsic = extrinsics[value];
    const sender = keyring.getPair(senderAddr.getValue());

    encode(extrinsic, sender, senderIndex.getValue(), Component.getValues());
  };

  return (
    <div
      className={['testing--CallDisplay', className].join(' ')}
      style={style}
    >
      <Component className='testing--CallDisplay-Component' />
      <Button
        className='testing--CallDisplay-Execute'
        onClick={onSubmit}
        primary
      >
        Submit Extrinsic
      </Button>
    </div>
  );
}

export default withObservable(CallDisplay, extrinsicName);
