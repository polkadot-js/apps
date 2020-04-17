// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// only here, needs to be available for the rest of the codebase
/* eslint-disable react/jsx-max-props-per-line */

import { DeriveStakingValidators } from '@polkadot/api-derive/types';
import { Balance, BlockNumber } from '@polkadot/types/interfaces';

import React from 'react';
import { Bubble, IdentityIcon } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatBalance, formatNumber } from '@polkadot/util';

function SummaryBar (): React.ReactElement {
  const { api, systemChain, systemName, systemVersion } = useApi();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []);
  const bestNumberLag = useCall<BlockNumber>(api.derive.chain.bestNumberLag, []);
  const totalIssuance = useCall<Balance>(api.query.balances?.totalIssuance, []);
  const validators = useCall<DeriveStakingValidators>(api.derive.staking.validators, []);

  return (
    <summary>
      <div>
        <Bubble icon='tty' label='node'>
          {systemName} v{systemVersion}
        </Bubble>
        <Bubble icon='chain' label='chain'>
          {systemChain}
        </Bubble>
        <Bubble icon='code' label='runtime'>
          {api.runtimeVersion.implName} v{api.runtimeVersion.implVersion.toString(10)}
        </Bubble>
        <Bubble icon='bullseye' label='best #'>
          {formatNumber(bestNumber)} ({formatNumber(bestNumberLag)} lag)
        </Bubble>
        {validators && (
          <Bubble icon='chess queen' label='validators'>{
            validators.validators.map((accountId, index): React.ReactNode => (
              <IdentityIcon key={index} size={20} value={accountId} />
            ))
          }</Bubble>
        )}
        {totalIssuance && (
          <Bubble
            icon='circle'
            label='total tokens'
          >
            {formatBalance(totalIssuance)}
          </Bubble>
        )}
      </div>
    </summary>
  );
}

export default React.memo(SummaryBar);
