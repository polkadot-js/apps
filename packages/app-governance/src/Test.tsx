// Copyright 2017-2018 @polkadot/app-governance authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-react-rx/types';

import BN from 'bn.js';
import React from 'react';

import storage from '@polkadot/storage';
import withApi from '@polkadot/ui-react-rx/with/api';
import encodeAddress from '@polkadot/util-keyring/address/encode';

type StorageProposal = [BN, any, Uint8Array];

type StorageReferendum = [BN, any, Uint8Array];

type StateProposals = {
  [index: string]: number[]
};

type StateReferendum = {
  [index: string]: number[]
};

type StateReferendumInfoOf = {
  [index: string]: number[]
};

type State = {
  proposals: StateProposals,
  active: StateReferendum,
  nextTally: number,
  referendumCount: number,
  referendumInfoOf: StateReferendumInfoOf
  subscriptions: Array<any>
};

class Test extends React.PureComponent<ApiProps, State> {
  constructor (props: ApiProps) {
    super(props);

    this.state = {
      proposals: {},
      active: {},
      nextTally: 0,
      referendumCount: 0,
      referendumInfoOf: {},
      subscriptions: []
    };
  }

  // TODO We should unsubscribe from subscriptions
  componentDidMount () {
    this.setState({
      subscriptions: [
        this.subscribeProposals(),
        this.subscribeNextTally()
        // this.subscribeReferendumCount(),
        // this.subscribeReferendumInfoOf()
      ]
    });
  }

  subscribeProposals () {
    const { api } = this.props;

    api.state
      .getStorage(storage.democracy.public.proposals)
      .subscribe((value: Array<StorageProposal>) => {
        console.log('value: ', value);
        this.setState({
          proposals: value.reduce((proposals: StateProposals, [propIdx, proposal, accountId]) => {
            const address = encodeAddress(accountId);

            if (!proposals[address]) {
              proposals[address] = [propIdx.toNumber()];
            } else {
              proposals[address].push(propIdx.toNumber());
            }

            return proposals;
          }, {} as StateProposals)
        });
      });
  }

  subscribeNextTally () {
    const { api } = this.props;

    api.state
      .getStorage(storage.democracy.public.nextTally)
      .subscribe((value: BN) => {
        console.log('nextTally: ', value);
        this.setState({
          nextTally: value.toNumber()
        });
      });
  }

  render () {
    const { proposals, nextTally } = this.state;
    console.log('proposals: ', proposals);
    console.log('nextTally: ', nextTally);

    return (
      <div>
        <div>Found {Object.keys(proposals).length} accounts making proposals.</div>
        <div>Next tally (next Referendum ID to be tallied) {nextTally}.</div>
      </div>
    );
  }
}

export default withApi(Test);
