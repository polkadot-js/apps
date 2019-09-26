/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';
import { BareProps, I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React, { useContext, useState, useEffect } from 'react';
import { ApiContext, withCalls } from '@polkadot/react-api';
import { Bubble, IdentityIcon } from '@polkadot/react-components';
import { formatBalance, formatNumber } from '@polkadot/util';

import translate from './translate';

interface Props extends BareProps, I18nProps {
  balances_totalIssuance?: BN;
  chain_bestNumber?: BN;
  chain_bestNumberLag?: BN;
  session_validators?: AccountId[];
  staking_intentions?: AccountId[];
}

function SummaryBar ({ balances_totalIssuance, chain_bestNumber, chain_bestNumberLag, staking_intentions, session_validators }: Props): React.ReactElement<Props> {
  const { api, systemChain, systemName, systemVersion } = useContext(ApiContext);
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
        <Bubble icon='chess queen' label='validators'>{
          (session_validators || []).map((accountId, index): React.ReactNode => (
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
    'query.session.validators'
  )(SummaryBar)
);
