import React from 'react';
import { Table, Segment } from 'semantic-ui-react';

import { withCalls } from '@polkadot/ui-api/with';
import { u32 } from '@polkadot/types';

import translate from './translate';
import { nonEmptyStr } from '@polkadot/joy-utils';
import { ProposalsMock, ProposalVotesMock } from './mocks';
import AddressMini from '@polkadot/ui-app/AddressMiniJoy';

type Props = {
  proposalIds?: Uint32Array
};

type State = {
};

class Component extends React.PureComponent<Props, State> {

  state: State = {};

  render () {
    let { proposalIds } = this.props;

    return (
      <div className='ui list'>{ProposalsMock.map((proposal, i) => (
        <Segment>
        <div className='item'>
          <div className='content'>
            {/* <div className='header'>Proposal #{proposal.id}</div> */}
            <h3 className='header'>
              <span style={{ marginRight: '1rem' }}>{proposal.name.toString()}</span>
              {this.renderStatus(proposal.status.toString())}
              <div className='ui basic label'>ID:<div className='detail'>{proposal.id.toString()}</div></div>
              <div className='ui basic label'>Votes:<div className='detail'>TODO</div></div>
            </h3>
            <div style={{ marginTop: '.5rem' }}>
              Proposed by <b><span style={{ margin: '0 .25rem' }}><AddressMini value={proposal.proposer} size={24} isShort={false} /></span></b> at block # <b>{proposal.proposed_at.toString()}</b>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '1.1rem' }}>
              <h4>Description</h4>
              <div>{proposal.description.toString()}</div>
              <div style={{ marginTop: '.5rem' }}>
                <h4 className='header'>Your vote:</h4>
                <div><em>TODO don't show voting buttons if you are not a councilor</em></div>
              </div>
              <div style={{ marginTop: '.5rem' }}>
                <button
                  className='ui green button'
                  onClick={e => this.submitVote('Approve')}
                >
                  <i className='ui check icon'></i>Approve
                </button>

                <button
                  className='ui orange button'
                  onClick={e => this.submitVote('Reject')}
                >
                  <i className='ui times icon'></i>Reject
                </button>

                <button
                  className='ui red button'
                  onClick={e => this.submitVote('Slash')}
                >
                  <i className='ui times icon'></i>Slash
                </button>

                <button
                  className='ui grey button'
                  onClick={e => this.submitVote('Abstention')}
                >
                  <i className='ui exclamation icon'></i>Abstain
                </button>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <h4 className='header'>Progress:</h4>
                <div>TODO show how many approval votes out of quorum recived so far.</div>
                <div>TODO Expires in N blocks</div>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <h4 className='header'>Casted council votes:</h4>
                {this.renderVotes(proposal.id)}
              </div>
            </div>
          </div>
        </div>
        </Segment>
      ))}</div>
    );
  }

  private submitVote = (voteKind: string) => {
    // TODO impl
  }

  private renderVotes = (proposalId: u32) => {
    const votes = ProposalVotesMock; // TODO get proposal votes from storage
    return (
      <Table celled selectable compact>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>#</Table.HeaderCell>
          <Table.HeaderCell>Vote</Table.HeaderCell>
          <Table.HeaderCell>Voter</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>{votes.map((vote, i) =>
        <Table.Row>
          <Table.Cell>{i + 1}</Table.Cell>
          <Table.Cell>{this.renderVoteKind(vote.kind.toString())}</Table.Cell>
          <Table.Cell><AddressMini value={vote.voter} size={24} isShort={false} /></Table.Cell>
        </Table.Row>
      )}</Table.Body>
      </Table>
    );
  }

  private renderVoteKind = (kind: string) => {
    let icon = '';
    let color = '';
    let text = '';
    if (kind === 'Approve') {
      icon = 'check';
      color = 'green';
      text = 'Approved';
    } else if (kind === 'Reject') {
      icon = 'times';
      color = 'orange';
      text = 'Rejected';
    } else if (kind === 'Slash') {
      icon = 'times';
      color = 'red';
      text = 'Slashed';
    } else if (kind === 'Abstention') {
      icon = 'exclamation';
      color = '';
      text = 'Abstained';
    }
    return (
      <span className={`ui basic ${color} label`} style={{ margin: '0 .5rem', textAlign: 'center', border: '0' }}>
        <i className={`${icon} icon`}></i>{text}
      </span>
    );
  }

  private renderStatus = (kind: string) => {
    let icon = '';
    let color = '';
    if (kind === 'Pending') { // TODO rename to 'Active'
      kind = 'Open for voting';
      icon = 'bullhorn';
      color = 'blue';
    } else if (kind === 'Approved') {
      icon = 'check';
      color = 'green';
    } else if (kind === 'Rejected') {
      icon = 'times';
      color = 'orange';
    } else if (kind === 'Slashed') {
      icon = 'times';
      color = 'red';
    } else if (kind === 'Cancelled') {
      icon = 'trash alternate';
      color = 'grey';
    } else if (kind === 'Expired') {
      icon = 'history';
      color = 'grey';
    }
    return (
      <span className={`ui basic ${color} label`}>
        <i className={`${icon} icon`}></i>{kind}
      </span>
    );
  }
}

// inject the actual API calls automatically into props
export default translate(
  withCalls<Props>(
    ['query.proposals.proposals', { propName: 'proposalIds' }]
  )(Component)
);
