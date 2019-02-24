import BN from 'bn.js';
import React from 'react';
import { Table, Message } from 'semantic-ui-react';

import { ApiProps } from '@polkadot/ui-api/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { withCalls } from '@polkadot/ui-api/with';
import { Labelled } from '@polkadot/ui-app/index';
import { formatNumber, formatBalance } from '@polkadot/ui-app/util';

import { queryToProp, ZERO } from '@polkadot/joy-utils/index';
import AddressMini from '@polkadot/ui-app/AddressMiniJoy';
import Section from '@polkadot/joy-utils/Section';
import translate from './translate';
import FilterProps from './FilterProps';
import { Seat, VoteKind, VoteKinds, Proposal, ProposalVotes, ProposalStatuses as Status } from '@polkadot/joy-utils/types';
import TxButton from '@polkadot/joy-utils/TxButton';
import AccountSelector from '@polkadot/joy-utils/AccountSelector';
import { Link } from 'react-router-dom';

const allVoteKinds = [
  VoteKinds.Approve,
  VoteKinds.Reject,
  VoteKinds.Slash,
  VoteKinds.Abstain
];

type Props = ApiProps & I18nProps & FilterProps & {
  preview?: boolean,
  activeCouncil?: Seat[],
  accountId?: string,
  id: BN,
  proposal?: Proposal,
  votes?: ProposalVotes,
  votingPeriod?: BN,
  bestNumber?: BN
};

type State = {
  preview: boolean,
  accountId?: string
};

export class Component extends React.PureComponent<Props, State> {

  constructor (props: Props) {
    super(props);
    const { preview = false, accountId } = this.props;
    this.state = {
      preview,
      accountId
    };
  }

  private onChangeAccount = (accountId?: string) => {
    this.setState({ accountId });
  }

  render () {
    const { proposal } = this.props;
    // console.log({ proposal });
    return !proposal ? null : this.renderProposal(proposal);
  }

  private renderProposal = (proposal: Proposal) => {
    const p = this.props;
    const { activeCouncil = [], votes = [], votingPeriod = ZERO, bestNumber = ZERO } = p;

    const { preview, accountId } = this.state;
    const accountAlreadyVoted = votes.length > 0
      && votes.find(([voter]) => voter.eq(accountId)) !== undefined;

    const expiresAt = proposal.proposed_at.add(votingPeriod);
    const blocksLeftForVoting = expiresAt.gt(bestNumber)
      ? expiresAt.sub(bestNumber)
      : ZERO;

    const proposalUrl = `/proposals/${proposal.id}`;

    // TODO Improve UX: use status to filter proposals:

    const status = proposal.status.toString();
    const isActive = status === Status.Active;
    // const isCancelled = status === Status.Cancelled;
    // const isExpired = status === Status.Expired;
    // const isApproved = status === Status.Approved;
    // const isRejected = status === Status.Rejected;
    // const isSlashed = status === Status.Slashed;
    // const isFinalized = !isActive;

    return <>
      <h2 className='header'>
        <span className='Proposal-name' style={{ marginRight: '.25rem' }}>
          {preview
            ? <Link to={proposalUrl}>{proposal.name}</Link>
            : proposal.name
          }
        </span>
        <span style={{ color: '#bbb' }}>
          {' #'}{formatNumber(proposal.id)}
        </span>
      </h2>

      <div style={{ margin: '1rem 0' }}>
        {this.renderStatus(proposal.status.toString())}
        <div className='ui basic label'>Votes:
          <div className='detail'>{votes.length} / {activeCouncil.length}</div>
        </div>
        {isActive && <div className='ui basic label'>Voting ends in:
          <div className='detail'>{formatNumber(blocksLeftForVoting)}</div>
        </div>}
        <div className='ui basic label'>Proposed at block #
          <div className='detail'>{formatNumber(proposal.proposed_at)}</div>
        </div>
        <div className='ui basic label'>Stake:
          <div className='detail'>{formatBalance(proposal.stake)}</div>
        </div>
      </div>

      <div style={{ marginTop: '.5rem' }}>
        <span className='Preview-label'>Hash of runtime upgrade: </span>
        <code>{proposal.wasm_hash.toString()}</code>
      </div>

      <div style={{ marginTop: '.5rem' }}>
        <span className='Preview-label' style={{ marginRight: '.25rem' }}>Proposer: </span>
        <AddressMini value={proposal.proposer} isShort={false} isPadded={true} withBalance={true} withName={true} size={36} />
      </div>

      {!preview && <div>
        <Section level={3} title='Description' className='Proposal-description'>
          {proposal.description}
        </Section>

        {/* <div style={{ marginTop: '1rem', color: 'skyblue' }}>
          <div><em>TODO Show how many approval votes out of quorum recived so far.</em></div>
          <div><em>TODO Voting ends in N blocks (if active)</em></div>
        </div> */}

        <Section level={3} title='Vote on this proposal'>
          <AccountSelector onChange={this.onChangeAccount} />
          <Labelled style={{ marginTop: '.5rem' }}>
            {accountAlreadyVoted
              ? <Message compact info size='tiny' content='Selected account already voted on this proposal.' />
              : allVoteKinds.map(voteKind => {
                const { color, icon } = this.styleOfVoteKind(voteKind);

                return <TxButton
                  isPrimary={false}
                  className={color}
                  accountId={accountId}
                  label={<><i className={`${icon} icon`}></i>{voteKind}</>}
                  params={[proposal.id, new VoteKind(voteKind)]}
                  tx='proposals.voteOnProposal'
                />;
              })}
          </Labelled>
        </Section>

        <Section level={3} title={`Casted votes (${votes.length})`}>
          {votes.length === 0 ? <em>No votes yet.</em> : this.renderVotes(votes)}
        </Section>
      </div>} {/* End of "if !preview" */}
    </>;
  }

  private renderVotes = (votes: ProposalVotes) => {
    return (
      <Table celled selectable compact>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>#</Table.HeaderCell>
          <Table.HeaderCell>Vote</Table.HeaderCell>
          <Table.HeaderCell>Council member</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>{votes.map(([voter, voteKind], i) => {
        return <Table.Row>
          <Table.Cell>{i + 1}</Table.Cell>
          <Table.Cell>{this.renderVoteKind(voteKind.toString())}</Table.Cell>
          <Table.Cell>
            <AddressMini value={voter} isShort={false} isPadded={false} withBalance={true} withName={true} size={36} />
          </Table.Cell>
        </Table.Row>;
      })}</Table.Body>
      </Table>
    );
  }

  private renderVoteKind = (voteKind: string) => {
    const { color, icon } = this.styleOfVoteKind(voteKind);
    return (
      <span className={`ui basic ${color} label`} style={{ margin: '0 .5rem', textAlign: 'center', border: '0' }}>
        <i className={`${icon} icon`}></i>{voteKind}
      </span>
    );
  }

  private styleOfVoteKind = (voteKind: string) => {
    let color = '';
    let icon = '';
    if (voteKind === 'Approve') {
      color = 'green';
      icon = 'check';
    } else if (voteKind === 'Reject') {
      color = 'orange';
      icon = 'times';
    } else if (voteKind === 'Slash') {
      color = 'red';
      icon = 'times';
    } else if (voteKind === 'Abstain') {
      color = 'grey';
      icon = 'exclamation';
    }
    return { color, icon };
  }

  private renderStatus = (voteKind: string) => {
    let icon = '';
    let color = '';
    if (voteKind === 'Active') {
      voteKind = 'Open for voting';
      icon = 'bullhorn';
      color = 'blue';
    } else if (voteKind === 'Approved') {
      icon = 'check';
      color = 'green';
    } else if (voteKind === 'Rejected') {
      icon = 'times';
      color = 'orange';
    } else if (voteKind === 'Slashed') {
      icon = 'times';
      color = 'red';
    } else if (voteKind === 'Cancelled') {
      icon = 'trash alternate';
      color = 'grey';
    } else if (voteKind === 'Expired') {
      icon = 'history';
      color = 'grey';
    }
    return (
      <span className={`ui basic ${color} label`}>
        <i className={`${icon} icon`}></i>{voteKind}
      </span>
    );
  }
}

export default translate(
  withCalls<Props>(
    queryToProp('derive.chain.bestNumber'),
    queryToProp('query.council.activeCouncil'),
    queryToProp('query.proposals.votingPeriod'),
    ['query.proposals.proposals',
      { paramName: 'id', propName: 'proposal' }],
    ['query.proposals.votesByProposal',
      { paramName: 'id', propName: 'votes' }]
  )(Component)
);
