import BN from 'bn.js';
import React from 'react';

import { ApiProps } from '@polkadot/ui-api/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { withCalls } from '@polkadot/ui-api/with';
import { BlockNumber, AccountId, Balance, Option } from '@polkadot/types';
import { Bubble } from '@polkadot/ui-app/index';
import { formatNumber, formatBalance } from '@polkadot/ui-app/util';

import Section from '@polkadot/joy-utils/Section';
import { queryToProp } from '@polkadot/joy-utils/index';
import { ElectionStage, Seat, Announcing } from '@polkadot/joy-utils/types';
import translate from './translate';

type Props = ApiProps & I18nProps & {
  bestNumber?: BN,

  activeCouncil?: Seat[],
  termEndsAt?: BlockNumber,

  autoStart?: Boolean,
  newTermDuration?: BN,
  candidacyLimit?: BN,
  councilSize?: BN,
  minCouncilStake?: Balance,
  minVotingStake?: Balance,
  announcingPeriod?: BlockNumber,
  votingPeriod?: BlockNumber,
  revealingPeriod?: BlockNumber,

  round?: BN,
  stage?: Option<ElectionStage>,
  applicants?: AccountId[]
};

type State = {};

class Dashboard extends React.PureComponent<Props, State> {

  state: State = {};

  renderCouncil () {
    const p = this.props;
    const { activeCouncil = [] } = p;
    const title = `Council ${activeCouncil.length > 0 ? '' : '(not elected)'}`;

    return <Section title={title}>
      <Bubble label='Council members'>
        {activeCouncil.length}
      </Bubble>
      <Bubble icon='flag checkered' label='Term ends at block #'>
        {formatNumber(p.termEndsAt)}
      </Bubble>
    </Section>;
  }

  renderElection () {
    const { bestNumber, round, stage, applicants = [] } = this.props;

    let stageName: string | undefined = undefined;
    let stageEndsAt: BlockNumber | undefined = undefined;
    if (stage && stage.isSome) {
      const stageValue = stage.value as ElectionStage;
      stageEndsAt = stageValue.value as BlockNumber;
      stageName = stageValue.type;
    }

    let leftBlocks: BN | undefined;
    if (stageEndsAt && bestNumber) {
      leftBlocks = stageEndsAt.sub(bestNumber);
    }

    const isNotRunning = stage && stage.value instanceof Announcing && stage.value.eq(0);
    const title = `Election (is ${isNotRunning ? 'not' : ''} running)`;

    return <Section title={title}>
      <Bubble icon='target' label='Election round #'>
        {formatNumber(round)}
      </Bubble>
      <Bubble label='Stage'>
        {stageName}
      </Bubble>
      <Bubble icon='flag checkered' label='Stage ends at block #'>
        {formatNumber(stageEndsAt)}
      </Bubble>
      <Bubble label='Blocks left'>
        {formatNumber(leftBlocks)}
      </Bubble>
      <Bubble label='Applicants'>
        {applicants.length}
      </Bubble>
    </Section>;
  }

  renderConfig () {
    const p = this.props;
    const isAutoStart = (p.autoStart || false).valueOf();

    return <Section title='Configuration'>
      <Bubble label='Auto-start elections'>
        {isAutoStart ? 'Yes' : 'No'}
      </Bubble>
      <Bubble label='New term duration'>
        {formatNumber(p.newTermDuration)}
      </Bubble>
      <Bubble label='Candidacy limit'>
        {formatNumber(p.candidacyLimit)}
      </Bubble>
      <Bubble label='Council size'>
        {formatNumber(p.councilSize)}
      </Bubble>
      <Bubble label='Min. council stake'>
        {formatBalance(p.minCouncilStake)}
      </Bubble>
      <Bubble label='Min. voting stake'>
        {formatBalance(p.minVotingStake)}
      </Bubble>
      <Bubble label='Announcing period'>
        {formatNumber(p.announcingPeriod)} blocks
      </Bubble>
      <Bubble label='Voting period'>
        {formatNumber(p.votingPeriod)} blocks
      </Bubble>
      <Bubble label='Revealing period'>
        {formatNumber(p.revealingPeriod)} blocks
      </Bubble>
    </Section>;
  }

  render () {
    return (
      <div className='JoySections'>
        {this.renderCouncil()}
        {this.renderElection()}
        {this.renderConfig()}
      </div>
    );
  }
}

// inject the actual API calls automatically into props
export default translate(
  withCalls<Props>(
    queryToProp('derive.chain.bestNumber'),

    queryToProp('query.council.activeCouncil'),
    queryToProp('query.council.termEndsAt'),

    queryToProp('query.councilElection.autoStart'),
    queryToProp('query.councilElection.newTermDuration'),
    queryToProp('query.councilElection.candidacyLimit'),
    queryToProp('query.councilElection.councilSize'),

    queryToProp('query.councilElection.minCouncilStake'),
    queryToProp('query.councilElection.minVotingStake'),

    queryToProp('query.councilElection.announcingPeriod'),
    queryToProp('query.councilElection.votingPeriod'),
    queryToProp('query.councilElection.revealingPeriod'),

    queryToProp('query.councilElection.stage'),
    queryToProp('query.councilElection.round'),
    queryToProp('query.councilElection.applicants')
  )(Dashboard)
);
