// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Option, TreasuryProposal } from '@polkadot/types';
import { InputAddress, Labelled, Static } from '@polkadot/ui-app';
import { withCalls, withMulti } from '@polkadot/ui-api';
import { formatBalance } from '@polkadot/util';

import translate from '../translate';
import Item from './Item';
import Approve from './Approve';

type Props = I18nProps & {
  isApproved: boolean,
  proposal?: TreasuryProposal | null,
  proposalIndex: string
};

class ProposalDisplay extends React.PureComponent<Props> {
  render () {
    const { isApproved, proposal, proposalIndex } = this.props;

    if (!proposal) {
      return null;
    }

    return (
      <Item
        isApproved={isApproved}
        proposal={proposal}
        proposalExtra={this.renderExtra()}
        proposalIndex={proposalIndex}
      >
        {
          !isApproved && (
            <Approve proposalIndex={proposalIndex}/>
          )
        }
      </Item>
    );
  }

  private renderExtra () {
    const { isApproved, proposal, t } = this.props;

    if (!proposal) {
      return null;
    }

    const { bond, beneficiary, proposer, value } = proposal;

    return (
      <div className={['treasury--Proposal-info', !isApproved && 'with-children'].join(' ')}>
        <Labelled label={t('proposed by')}>
          <InputAddress
            isDisabled
            value={proposer}
            withLabel={false}
          />
        </Labelled>
        <Labelled label={t('beneficiary')}>
          <InputAddress
            isDisabled
            value={beneficiary}
            withLabel={false}
          />
        </Labelled>
        <Static label={t('value')}>
          {formatBalance(value)}
        </Static>
        <Static label={t('bond')}>
          {formatBalance(bond)}
        </Static>
      </div>
    );
  }
}

export default withMulti(
  ProposalDisplay,
  translate,
  withCalls<Props>(
    ['query.treasury.proposals', {
      paramName: 'proposalIndex',
      propName: 'proposal',
      transform: (value: Option<TreasuryProposal>) =>
        value.unwrapOr(null)
    }]
  )
);
