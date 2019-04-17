import React from 'react';

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { withCalls } from '@polkadot/ui-api/with';
import { Hash } from '@polkadot/types';

import translate from './translate';
import SealedVote from './SealedVote';
import { queryToProp } from '@polkadot/joy-utils/index';
import { MyAddressProps } from '@polkadot/joy-utils/MyAccount';
import { SavedVote } from './myVotesStore';
import Section from '@polkadot/joy-utils/Section';

type Props = ApiProps & I18nProps & MyAddressProps & {
  myVotes?: SavedVote[],
  commitments?: Hash[]
};

class Comp extends React.PureComponent<Props> {

  private filterVotes = (myVotesOnly: boolean): Hash[] => {
    const { myVotes = [], commitments = [] } = this.props;
    const isMyVote = (hash: string): boolean => {
      return myVotes.find(x => x.hash === hash) !== undefined;
    };
    return commitments.filter(x => myVotesOnly === isMyVote(x.toHex()));
  }

  private renderVotes = (votes: Hash[]) => {
    return votes.map((hash, index) =>
      <SealedVote key={index} hash={hash} />
    );
  }

  render () {
    const myVotes = this.filterVotes(true);
    const otherVotes = this.filterVotes(false);

    return <>
      <Section title={`My previous votes (${myVotes.length})`}>{
        !myVotes.length
        ? <em>No votes by the current account found on the current browser.</em>
        : this.renderVotes(myVotes)
      }</Section>
      <Section title={`Other votes (${otherVotes.length})`}>{
        !otherVotes.length
        ? <em>No votes submitted by other accounts yet.</em>
        : this.renderVotes(otherVotes)
      }</Section>
    </>;
  }
}

// inject the actual API calls automatically into props
export default translate(
  withCalls<Props>(
    queryToProp('query.councilElection.commitments')
  )(Comp)
);
