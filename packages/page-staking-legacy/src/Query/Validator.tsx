// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props } from './types.js';

import React from 'react';

import { Columar, styled } from '@polkadot/react-components';

import ChartPoints from './ChartPoints.js';
import ChartPrefs from './ChartPrefs.js';
import ChartRewards from './ChartRewards.js';
import ChartStake from './ChartStake.js';

function Validator ({ className = '', labels, validatorId }: Props): React.ReactElement<Props> | null {
  return (
    <StyledColumar className={className}>
      <Columar.Column>
        <ChartPoints
          labels={labels}
          validatorId={validatorId}
        />
        <ChartRewards
          labels={labels}
          validatorId={validatorId}
        />
      </Columar.Column>
      <Columar.Column>
        <ChartStake
          labels={labels}
          validatorId={validatorId}
        />
        <ChartPrefs
          labels={labels}
          validatorId={validatorId}
        />
      </Columar.Column>
    </StyledColumar>
  );
}

const StyledColumar = styled(Columar)`
  .staking--Chart {
    background: var(--bg-table);
    border: 1px solid var(--border-table);
    border-radius: 0.25rem;
    padding: 1rem 1.5rem;
  }
`;

export default React.memo(Validator);
