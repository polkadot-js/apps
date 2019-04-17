import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'semantic-ui-react';

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { withCalls } from '@polkadot/ui-api/with';
import { Hash } from '@polkadot/types';
import { formatBalance } from '@polkadot/util';

import translate from './translate';
import { calcTotalStake } from '@polkadot/joy-utils/index';
import { SealedVote } from '@polkadot/joy-utils/types';
import AddressMini from '@polkadot/ui-app/AddressMiniJoy';
import { findVoteByHash } from './myVotesStore';

type Props = ApiProps & I18nProps & {
  hash: Hash,
  sealedVote?: SealedVote
};

class Comp extends React.PureComponent<Props> {

  renderCandidateOrAction () {
    const { hash, sealedVote } = this.props;
    if (!sealedVote) {
      return <em>Unknown hashed vote: {hash.toHex()}</em>;
    }

    if (sealedVote.vote.isSome) {
      const candidateId = sealedVote.vote.unwrap();
      return <AddressMini value={candidateId} isShort={false} isPadded={false} withBalance={true} withName={true} withMemo={true} size={36} />;
    } else {
      const revealUrl = `/council/reveals?hashedVote=${hash.toHex()}`;
      return <Link to={revealUrl} className='ui button primary inverted'>Reveal this vote</Link>;
    }
  }

  render () {
    const { hash, sealedVote } = this.props;
    const myVote = findVoteByHash(hash.toHex());

    return !sealedVote ? null : (
      <Table celled selectable compact definition className='SealedVoteTable'>
      <Table.Body>
      <Table.Row>
        <Table.Cell>Hash</Table.Cell>
        <Table.Cell><code>{hash.toHex()}</code></Table.Cell>
      </Table.Row>
      {myVote && <Table.Row>
        <Table.Cell>Salt</Table.Cell>
        <Table.Cell><code>{myVote.salt}</code></Table.Cell>
      </Table.Row>}
      <Table.Row>
        <Table.Cell>Stake</Table.Cell>
        <Table.Cell>{formatBalance(calcTotalStake(sealedVote.stake))}</Table.Cell>
      </Table.Row>
      {myVote && <Table.Row>
        <Table.Cell>Voted on</Table.Cell>
        <Table.Cell>{new Date(myVote.votedOnTime).toLocaleString()}</Table.Cell>
      </Table.Row>}
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
