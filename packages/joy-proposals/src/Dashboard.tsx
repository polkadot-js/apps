import BN from 'bn.js';
import React from 'react';

import { ApiProps } from '@polkadot/ui-api/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { withCalls } from '@polkadot/ui-api/with';
import { BlockNumber, Balance } from '@polkadot/types';
import { Bubble } from '@polkadot/ui-app/index';
import { formatNumber, formatBalance } from '@polkadot/util';

import { queryToProp, ZERO } from '@polkadot/joy-utils/index';
import Section from '@polkadot/joy-utils/Section';
import translate from './translate';

type Props = ApiProps & I18nProps & {
  bestNumber?: BN,
  approvalQuorum: BN,
  minStake: Balance,
  cancellationFee: Balance,
  rejectionFee: Balance,
  votingPeriod: BlockNumber,
  nameMaxLen: BN,
  descriptionMaxLen: BN,
  wasmCodeMaxLen: BN,
  proposalCount: BN,
  activeProposalIds: BN[]
};

type State = {};

class Dashboard extends React.PureComponent<Props, State> {

  state: State = {};

  renderProposals () {
    const p = this.props;
    const { proposalCount = ZERO, activeProposalIds = [] } = p;

    return <Section title='Proposals'>
      <Bubble label='Active proposals'>
        {activeProposalIds.length}
      </Bubble>
      <Bubble label='All proposals'>
        {formatNumber(proposalCount)}
      </Bubble>
    </Section>;
  }

  renderConfig () {
    const p = this.props;
    return <Section title='Configuration'>
      <Bubble label='Approval quorum'>
        {formatNumber(p.approvalQuorum)}%
      </Bubble>
      <Bubble label='Min. stake for proposal'>
        {formatBalance(p.minStake)}
      </Bubble>
      <Bubble label='Min. cancellation fee'>
        {formatBalance(p.cancellationFee)}
      </Bubble>
      <Bubble label='Min. rejection fee'>
        {formatBalance(p.rejectionFee)}
      </Bubble>
      <Bubble label='Voting period'>
        {formatNumber(p.votingPeriod)} blocks
      </Bubble>
      <Bubble label='Max. length of name'>
        {formatNumber(p.nameMaxLen)} chars
      </Bubble>
      <Bubble label='Max. length of description'>
        {formatNumber(p.descriptionMaxLen)} chars
      </Bubble>
      <Bubble label='Max. length of WASM code'>
        {formatNumber(p.wasmCodeMaxLen)} chars
      </Bubble>
    </Section>;
  }

  render () {
    return (
      <div className='JoySections'>
        {this.renderProposals()}
        {this.renderConfig()}
      </div>
    );
  }
}

// inject the actual API calls automatically into props
export default translate(
  withCalls<Props>(
    queryToProp('derive.chain.bestNumber'),
    queryToProp('query.proposals.approvalQuorum'), // TODO rename to 'quorumPercent' ?
    queryToProp('query.proposals.minStake'),
    queryToProp('query.proposals.cancellationFee'),
    queryToProp('query.proposals.rejectionFee'),
    queryToProp('query.proposals.votingPeriod'),
    queryToProp('query.proposals.nameMaxLen'),
    queryToProp('query.proposals.descriptionMaxLen'),
    queryToProp('query.proposals.wasmCodeMaxLen'),
    queryToProp('query.proposals.proposalCount'),
    queryToProp('query.proposals.activeProposalIds')
  )(Dashboard)
);
