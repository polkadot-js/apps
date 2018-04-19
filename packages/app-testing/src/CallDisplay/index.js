// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps, BaseContext } from '../types';

import './CallDisplay.css';

import PropTypes from 'prop-types';
import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';
import withObservable from '@polkadot/rx-react/with/observable';

import StakingStake from '../Staking/Stake';
import StakingTransfer from '../Staking/Transfer';
import StakingUnstake from '../Staking/Unstake';
import { extrinsicName } from '../subjects';
import ErrorComponent from './Error';
import submitExtrinsic from './submit';

type ValueGetter = {
  getValues: () => Array<mixed>
}

type Props = BaseProps & {
  value?: string;
};

const COMPONENTS = {
  'staking_stake': StakingStake,
  'staking_transfer': StakingTransfer,
  'staking_unstake': StakingUnstake
};

function CallDisplay ({ className, style, value }: Props, { api }: BaseContext) {
  // flowlint-next-line sketchy-null-string:off
  if (!value) {
    return null;
  }

  const Component = COMPONENTS[value] || ErrorComponent;
  const onSubmit = () => {
    // flowlint-next-line unclear-type:off
    submitExtrinsic(api, value, ((Component: any): ValueGetter).getValues());
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

CallDisplay.contextTypes = {
  api: PropTypes.object
};

export default withObservable(CallDisplay, extrinsicName);
