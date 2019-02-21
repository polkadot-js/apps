import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'semantic-ui-react';

import { Hash } from '@polkadot/types';
import { withCalls } from '@polkadot/ui-api/with';
import { formatBalance } from '@polkadot/ui-app/util';

import translate from './translate';
import { calcTotalStake } from '@polkadot/joy-utils/index';
import { SealedVote } from '@polkadot/joy-utils/types';
import AddressMini from '@polkadot/ui-app/AddressMiniJoy';

type Props = {
  hash: Hash,
  sealedVote?: SealedVote
};

type State = {};

class Comp extends React.PureComponent<Props, State> {

  state: State = {};

  renderCandidateOrAction () {
    const { hash, sealedVote } = this.props;
    if (!sealedVote) {
      return <em>Unknown hashed vote: {hash.toHex()}</em>;
    }

    if (sealedVote.vote.isSome) {
      const candidateId = sealedVote.vote.unwrap();
      return <AddressMini value={candidateId} isShort={false} isPadded={false} withBalance={true} withName={true} size={36} />;
    } else {
      const revealUrl = `/council/reveals?hashedVote=${hash.toHex()}`;
      return <Link to={revealUrl} className='ui button primary inverted'>Reveal this vote</Link>;
    }
  }

  render () {
    const { hash, sealedVote } = this.props;
    console.log('SealedVote:', hash, sealedVote);

    return !sealedVote ? null : (
      <Table celled selectable compact definition className='SealedVoteTable'>
      <Table.Body>
      <Table.Row>
        <Table.Cell>Hash</Table.Cell>
        <Table.Cell><code>{hash.toHex()}</code></Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Stake</Table.Cell>
        <Table.Cell>{formatBalance(calcTotalStake(sealedVote.stake))}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Voter</Table.Cell>
        <Table.Cell><AddressMini value={sealedVote.voter} isShort={false} isPadded={false} withBalance={true} withName={true} size={36} /></Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Candidate</Table.Cell>
        <Table.Cell>{this.renderCandidateOrAction()}</Table.Cell>
      </Table.Row>
      </Table.Body>
      </Table>
    );
  }
}

// inject the actual API calls automatically into props
export default translate(
  withCalls<Props>(
    ['query.councilElection.votes', 
      { paramName: 'hash', propName: 'sealedVote' }]
  )(Comp)
);
