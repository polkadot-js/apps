// Copyright 2017-2018 @polkadot/app-example authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-react-rx/types';

import BN from 'bn.js';
import React from 'react';

import storage from '@polkadot/storage';
import withApi from '@polkadot/ui-react-rx/with/api';

type StorageProposal = [BN, any, string];

type StateProposals = {
  [index: string]: number[]
};

type State = {
  proposals: StateProposals
};

class Comp extends React.PureComponent<ApiProps, State> {
  constructor (props: ApiProps) {
    super(props);

    this.state = {
      proposals: {}
    };
  }

  // TODO We should unsubscribe from subscriptions
  componentDidMount () {
    this.subscribeProposals();
  }

  subscribeProposals () {
    const { api } = this.props;

    api.state
      .getStorage(storage.democracy.public.proposals)
      .subscribe((value: Array<StorageProposal>) => {
        this.setState({
          proposals: value.reduce((proposals: StateProposals, [propIdx, proposal, accountId]) => {
            if (!proposals[accountId]) {
              proposals[accountId] = [propIdx.toNumber()];
            } else {
              proposals[accountId].push(propIdx.toNumber());
            }

            return proposals;
          }, {} as StateProposals)
        });
      });
  }

  render () {
    const { proposals } = this.state;

    return (
      <div>Found {Object.keys(proposals).length} accounts making proposals.</div>
    );
  }
}

export default withApi(Comp);
