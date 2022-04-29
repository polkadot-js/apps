// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props } from './types';

import React from 'react';
import styled from 'styled-components';

import { Columar } from '@polkadot/react-components';

import ChartPoints from './ChartPoints';
import ChartPrefs from './ChartPrefs';
import ChartRewards from './ChartRewards';
import ChartStake from './ChartStake';

function Validator ({ className = '', validatorId }: Props): React.ReactElement<Props> {
  return (
    <Columar className={className}>
      <Columar.Column>
        <ChartPoints validatorId={validatorId} />
        <ChartRewards validatorId={validatorId} />
      </Columar.Column>
      <Columar.Column>
        <ChartStake validatorId={validatorId} />
        <ChartPrefs validatorId={validatorId} />
      </Columar.Column>
    </Columar>
  );
}

export default React.memo(styled(Validator)`
  .staking--Chart {
    background: var(--bg-table);
    border: 1px solid var(--border-table);
    border-radius: 0.25rem;
    padding: 1rem 1.5rem;
  }
`);
