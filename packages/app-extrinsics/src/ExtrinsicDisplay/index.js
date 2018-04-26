// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '../types';

import './ExtrinsicDisplay.css';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';
import withObservable from '@polkadot/rx-react/with/observable';

import translate from '../translate';
import StakingStake from '../Staking/Stake';
import StakingTransfer from '../Staking/Transfer';
import StakingUnstake from '../Staking/Unstake';
import { extrinsic } from '../subjects';
import ErrorComponent from './Error';
import queueExtrinsic from './queue';

type ValueGetter = {
  getValues: () => Array<mixed>
}

type Props = BaseProps & {
  value?: string;
};

const Components = {
  'staking_stake': StakingStake,
  'staking_transfer': StakingTransfer,
  'staking_unstake': StakingUnstake
};

function ExtrinsicDisplay ({ className, style, t, value }: Props): React$Node {
  // flowlint-next-line sketchy-null-string:off
  if (!value) {
    return null;
  }

  const Component = Components[value.name] || ErrorComponent;
  const onSubmit = () => {
    // flowlint-next-line unclear-type:off
    queueExtrinsic(value, ((Component: any): ValueGetter).getValues());
  };

  return (
    <div
      className={['extrinsics--ExtrinsicDisplay', className].join(' ')}
      style={style}
    >
      <Component className='extrinsics--ExtrinsicDisplay-Component' />
      <div className='extrinsics--ExtrinsicDisplay-ButtonRow'>
        <Button
          className='extrinsics--ExtrinsicDisplay-Button'
          onClick={onSubmit}
          primary
        >
          {t('calldisplay.submit', {
            defaultValue: 'Submit Extrinsic'
          })}
        </Button>
      </div>
    </div>
  );
}

export default translate(
  withObservable(extrinsic)(ExtrinsicDisplay)
);
