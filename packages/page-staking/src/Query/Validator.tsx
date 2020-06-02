// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from './types';

import React from 'react';
import { Columar, Column } from '@polkadot/react-components';

import ChartPoints from './ChartPoints';
import ChartRewards from './ChartRewards';
import ChartStake from './ChartStake';

function Validator ({ className = '', validatorId }: Props): React.ReactElement<Props> {
  return (
    <Columar className={className}>
      <Column>
        <ChartPoints validatorId={validatorId} />
        <ChartRewards validatorId={validatorId} />
      </Column>
      <Column>
        <ChartStake validatorId={validatorId} />
      </Column>
    </Columar>
  );
}

export default React.memo(Validator);
