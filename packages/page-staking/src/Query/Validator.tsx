// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props } from './types';
import type { ThemeProps } from '@polkadot/react-components/types';

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

export default React.memo(styled(Validator)(({ theme }: ThemeProps) =>`
  .staking--Chart {
    background: ${theme.theme};
    border: 1px solid #eeecea;
    border-radius: 0.25rem;
    padding: 1rem 1.5rem;
  }
`));
