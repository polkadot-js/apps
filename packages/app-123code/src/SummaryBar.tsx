// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { BareProps, I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { AccountId, RuntimeVersion } from '@polkadot/types';
import { withCalls } from '@polkadot/ui-api/with';
import { Bubble, IdentityIcon } from '@polkadot/ui-app';
import { formatBalance, formatNumber } from '@polkadot/ui-util';

import translate from './translate';

type Props = ApiProps & BareProps & I18nProps & {
  balances_totalIssuance?: BN,
  chain_bestNumber?: BN,
  chain_bestNumberLag?: BN,
  chain_getRuntimeVersion?: RuntimeVersion,
  session_validators?: Array<AccountId>,
  staking_intentions?: Array<AccountId>,
  system_chain?: string,
  system_name?: string,
  system_version?: string
};
type State = {
  nextUp: Array<AccountId>
};

class SummaryBar extends React.PureComponent<Props, State> {
  state: State = {
    nextUp: []
  };

  static getDerivedStateFromProps ({ staking_intentions, session_validators }: Props): State | null {
    if (!staking_intentions || !session_validators) {
      return null;
    }

    return {
      nextUp: staking_intentions.filter((accountId) =>
        !session_validators.find((validatorId) => validatorId.eq(accountId))
      )
    };
  }

  render () {
    const { balances_totalIssuance, chain_bestNumber, chain_bestNumberLag, chain_getRuntimeVersion, session_validators = [], system_chain, system_name, system_version } = this.props;
    const { nextUp } = this.state;

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
            chain_getRuntimeVersion
              ? `${chain_getRuntimeVersion.implName} v${chain_getRuntimeVersion.implVersion}`
              : undefined
          }</Bubble>
          <Bubble icon='bullseye' label='best #'>
            {formatNumber(chain_bestNumber)} ({formatNumber(chain_bestNumberLag)} lag)
          </Bubble>
          <Bubble icon='chess queen' label='validators'>{
            session_validators.map((accountId, index) => (
              <IdentityIcon key={index} value={accountId} size={20} />
            ))
          }</Bubble>
          <Bubble icon='chess bishop' label='next up'>{
            nextUp.map((accountId, index) => (
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
}

// inject the actual API calls automatically into props
export default translate(
  withCalls<Props>(
    'derive.chain.bestNumber',
    'derive.chain.bestNumberLag',
    'query.balances.totalIssuance',
    'query.session.validators',
    'query.staking.intentions',
    'rpc.chain.getRuntimeVersion',
    'rpc.system.chain',
    'rpc.system.name',
    'rpc.system.version'
  )(SummaryBar)
);
