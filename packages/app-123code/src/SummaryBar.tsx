// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { BareProps, I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { AccountId, RuntimeVersion } from '@polkadot/types';
import { withCalls } from '@polkadot/ui-api/with';
import { Bubble, IdentityIcon } from '@polkadot/ui-app/index';
import { formatBalance, formatNumber } from '@polkadot/ui-app/util';

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
type State = {};

class SummaryBar extends React.PureComponent<Props, State> {
  render () {
    const { balances_totalIssuance, chain_bestNumber, chain_bestNumberLag, chain_getRuntimeVersion, staking_intentions = [], session_validators = [], system_chain, system_name, system_version } = this.props;

    return (
      <summary>
        <div>
          <Bubble icon='tty' text='node'>
            {system_name} v{system_version}
          </Bubble>
          <Bubble icon='chain' text='chain'>
            {system_chain}
          </Bubble>
          <Bubble icon='code' text='runtime'>{
            chain_getRuntimeVersion
              ? `${chain_getRuntimeVersion.implName} v${chain_getRuntimeVersion.implVersion}`
              : undefined
          }</Bubble>
          <Bubble icon='bullseye' text='best #'>
            {formatNumber(chain_bestNumber)} ({formatNumber(chain_bestNumberLag)} lag)
          </Bubble>
          <Bubble icon='chess queen' text='validators'>{
            session_validators.map((accountId, index) => (
              <IdentityIcon key={index} value={accountId} size={20} />
            ))
          }</Bubble>
          <Bubble icon='chess bishop' text='intentions'>{
            staking_intentions.map((accountId, index) => (
              <IdentityIcon key={index} value={accountId} size={20} />
            ))
          }</Bubble>
          <Bubble icon='adjust' text='total tokens'>
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
