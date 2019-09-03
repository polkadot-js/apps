/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, RuntimeVersion } from '@polkadot/types/interfaces';
import { BareProps, I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React, { useState, useEffect } from 'react';
import { withCalls } from '@polkadot/react-api/with';
import { Bubble, IdentityIcon } from '@polkadot/react-components';
import { formatBalance, formatNumber } from '@polkadot/util';

import translate from './translate';

interface Props extends BareProps, I18nProps {
  balances_totalIssuance?: BN;
  chain_bestNumber?: BN;
  chain_bestNumberLag?: BN;
  session_validators?: AccountId[];
  staking_intentions?: AccountId[];
  state_getRuntimeVersion?: RuntimeVersion;
  system_chain?: string;
  system_name?: string;
  system_version?: string;
}

function SummaryBar ({ balances_totalIssuance, chain_bestNumber, chain_bestNumberLag, staking_intentions = [], session_validators = [], state_getRuntimeVersion, system_chain, system_name, system_version }: Props): React.ReactElement<Props> {
  const [nextUp, setNextUp] = useState<AccountId[]>([]);

  useEffect((): void => {
    if (staking_intentions && session_validators) {
      setNextUp(staking_intentions.filter((accountId): boolean =>
        !session_validators.find((validatorId): boolean =>
          validatorId.eq(accountId)
        )
      ));
    }
  }, [staking_intentions, session_validators]);

  return (
    <summary>
      <div>
        <Bubble icon='tty' label='node'>
          {system_name} v{system_version}
        </Bubble>
        <Bubble icon='chain' label='chain'>
          {system_chain}
        </Bubble>
        <Bubble icon='code' label='runtime'>{
          state_getRuntimeVersion &&
            `${state_getRuntimeVersion.implName} v${state_getRuntimeVersion.implVersion}`
        }</Bubble>
        <Bubble icon='bullseye' label='best #'>
          {formatNumber(chain_bestNumber)} ({formatNumber(chain_bestNumberLag)} lag)
        </Bubble>
        <Bubble icon='chess queen' label='validators'>{
          session_validators.map((accountId, index): React.ReactNode => (
            <IdentityIcon key={index} value={accountId} size={20} />
          ))
        }</Bubble>
        <Bubble icon='chess bishop' label='next up'>{
          nextUp.map((accountId, index): React.ReactNode => (
            <IdentityIcon key={index} value={accountId} size={20} />
          ))
        }</Bubble>
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
    'query.balances.totalIssuance',
    'query.session.validators',
    'rpc.state.getRuntimeVersion',
    'rpc.system.chain',
    'rpc.system.name',
    'rpc.system.version'
  )(SummaryBar)
);
