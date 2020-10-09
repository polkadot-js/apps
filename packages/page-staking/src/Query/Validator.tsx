// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Props } from './types';

import React from 'react';
import styled from 'styled-components';
import { Columar, Column } from '@polkadot/react-components';

import ChartPoints from './ChartPoints';
import ChartPrefs from './ChartPrefs';
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
        <ChartPrefs validatorId={validatorId} />
      </Column>
    </Columar>
  );
}

export default React.memo(styled(Validator)`
  .staking--Chart {
    background: white;
    border: 1px solid #eeecea;
    border-radius: 0.25rem;
    padding: 1rem 1.5rem;
  }
`);
