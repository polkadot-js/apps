import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'semantic-ui-react';

import { Hash } from '@polkadot/types';
import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { withCalls } from '@polkadot/ui-api/with';

import translate from './translate';
import { HashedVote } from './utils';
import { HashedVotesMock } from './mocks';

type Props = AppProps & {
  commitments?: Array<Hash>
};

type State = {
  hashedVotes: Array<HashedVote>
};

class App extends React.PureComponent<Props, State> {

  constructor (props: Props) {
    super(props);
    this.state = {
      hashedVotes: HashedVotesMock // TODO convert `commitments` to `hashedVotes`
    };
  }

  render () {
    const { hashedVotes = [] } = this.state;
    return (
      <div>{!hashedVotes.length
        ? <em>No votes submitted yet.</em>
        : <Table celled selectable compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>#</Table.HeaderCell>
              <Table.HeaderCell>Hash of vote</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{hashedVotes.map((vote, index) => {
            const revealUrl = `/election/reveals?hashedVote=${vote.hash}`;
            return <Table.Row>
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell><code>{vote.hash}</code></Table.Cell>
              <Table.Cell>
                <Link to={revealUrl} className='ui button primary inverted'>Reveal this Vote</Link>
              </Table.Cell>
            </Table.Row>
          })}</Table.Body>
          </Table>
      }</div>
    );
  }
}

// inject the actual API calls automatically into props
export default translate(
  withCalls<Props>(
    ['query.councilElection.commitments', { propName: 'commitments' }]
  )(App)
);