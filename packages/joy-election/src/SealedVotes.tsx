import React from 'react';

import { Hash } from '@polkadot/types';
import { AppProps } from '@polkadot/ui-app/types';
import { withCalls } from '@polkadot/ui-api/with';

import translate from './translate';
import SealedVote from './SealedVote';
import { queryToProp } from '@polkadot/joy-utils/index';

type Props = AppProps & {
  commitments?: Hash[]
};

type State = {};

class Comp extends React.PureComponent<Props, State> {

  state: State = {};

  render () {
    const { commitments = [] } = this.props;
    return !commitments.length
      ? <em>No votes submitted yet.</em>
      : commitments.map((hash, index) =>
        <SealedVote key={index} hash={hash} />
      );
  }
}

// inject the actual API calls automatically into props
export default translate(
  withCalls<Props>(
    queryToProp('query.councilElection.commitments')
  )(Comp)
);
