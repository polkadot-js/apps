/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';
import { BareProps, I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import { withCalls } from '@polkadot/react-api';
import { Bubble, IdentityIcon } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { formatBalance, formatNumber } from '@polkadot/util';

import translate from './translate';

interface Props extends BareProps, I18nProps {
  balances_totalIssuance?: BN;
  chain_bestNumber?: BN;
  chain_bestNumberLag?: BN;
  staking_validators?: AccountId[];
}

function SummaryBar ({ balances_totalIssuance, chain_bestNumber, chain_bestNumberLag, staking_validators }: Props): React.ReactElement<Props> {
  const { api, systemChain, systemName, systemVersion } = useApi();

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
          {api.runtimeVersion.implName} v{api.runtimeVersion.implVersion}
        </Bubble>
        <Bubble icon='bullseye' label='best #'>
          {formatNumber(chain_bestNumber)} ({formatNumber(chain_bestNumberLag)} lag)
        </Bubble>
        {staking_validators && (
          <Bubble icon='chess queen' label='validators'>{
            staking_validators.map((accountId, index): React.ReactNode => (
              <IdentityIcon key={index} value={accountId} size={20} />
            ))
          }</Bubble>
        )}
        <Bubble icon='circle' label='total tokens'>
          {formatBalance(balances_totalIssuance)}
        </Bubble>
      </div>
    </summary>
  );
}

// inject the actual API calls automatically into props
export default translate(
  withCalls<Props>(
    'derive.chain.bestNumber',
    'derive.chain.bestNumberLag',
    'derive.staking.validators',
    'query.balances.totalIssuance'
  )(SummaryBar)
);
