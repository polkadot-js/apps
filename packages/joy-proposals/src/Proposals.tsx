import BN from 'bn.js';
import React from 'react';
import { Segment } from 'semantic-ui-react';

import { ApiProps } from '@polkadot/ui-api/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { withCalls } from '@polkadot/ui-api/with';

import { queryToProp, ZERO } from '@polkadot/joy-utils/index';
import { Seat } from '@polkadot/joy-utils/types';
import Section from '@polkadot/joy-utils/Section';
import translate from './translate';
import Details from './Details';
import FilterProps from './FilterProps';

type Props = ApiProps & I18nProps & FilterProps & {
  title: string,
  proposalCount?: BN,
  activeProposalIds?: BN[],
  activeCouncil?: Seat[]
};

type State = {};

export class Component extends React.PureComponent<Props, State> {

  state: State = {};

  render () {
    const {
      title = 'Proposals',
      showActiveOnly,
      showFinalizedOnly,
      proposalCount = ZERO,
      activeProposalIds = []
    } = this.props;

    const activeIdsSet = new Set(activeProposalIds.map(x => x.toString()));
    const ids: BN[] = [];
    let i: number = proposalCount.toNumber();
    for (; i > 0; i--) {
      const id = new BN(i);
      const isActive = activeIdsSet.has(id.toString());
      if (
        isActive && showActiveOnly === true ||
        !isActive && showFinalizedOnly === true ||
        showActiveOnly !== true && showFinalizedOnly !== true
      ) {
        ids.push(id);
      }
    }

    return (
      <Section title={title}>{
        ids.length === 0
          ? <em>No proposals found.</em>
          : ids.map((id, i) =>
            <Segment className='ProposalPreviews'>
              <div className='item'>
                <div className='content Proposal'>
                  <Details {...this.props} key={i} id={id} preview />
                </div>
              </div>
            </Segment>
          )
      }</Section>
    );
  }
}

export default translate(
  withCalls<Props>(
    queryToProp('derive.chain.bestNumber'),
    queryToProp('query.proposals.proposalCount'),
    queryToProp('query.proposals.activeProposalIds'),
    queryToProp('query.council.activeCouncil')
  )(Component)
);
