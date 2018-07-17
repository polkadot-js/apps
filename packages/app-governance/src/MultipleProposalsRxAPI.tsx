// Copyright 2017-2018 @polkadot/app-governance authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-react-rx/types';

import BN from 'bn.js';
import React from 'react';

import storage from '@polkadot/storage';
import withApi from '@polkadot/ui-react-rx/with/api';
import encodeAddress from '@polkadot/util-keyring/address/encode';
import { Observable } from 'rxjs/Observable';
import { flatMap, mergeMap } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import { of } from 'rxjs/observable/of';

type StorageProposal = [BN, any, Uint8Array];

type StateProposals = {
  [index: string]: number[]
};

type State = {
  democracyProposals: StateProposals
};

class MultipleProposalsRxAPI extends React.PureComponent<ApiProps, State> {
  constructor (props: ApiProps) {
    super(props);

    this.state = {
      democracyProposals: {}
    };
  }

  // TODO We should unsubscribe from subscriptions
  componentDidMount () {
    this.subscribeProposals();
  }

  subscribeProposals () {
    const { api } = this.props;

    const cvps = storage.councilVoting.public.proposals;
    const dps = storage.democracy.public.proposals;
    const vtrs = storage.democracy.public.votersFor;
    // const vtrs = (proposalId) => {
    //   if (typeof storage.democracy.public.votersFor === 'function') {
    //   return storage.democracy.public.votersFor({ referendum: proposalId });
    // }

    // let requestStream1 = api.state.getStorage(cvps);
    let requestStream2 = api.state.getStorage(dps);
    // let requestStream3 = api.state.getStorage(vtrs);

    requestStream2
      .pipe(mergeMap((proposals) => {
        console.log('proposals: ', proposals);
        return api.state.getStorage(vtrs, 1);
      }))
      .subscribe((value: any) => { //: Array<StorageProposal>
        console.log('value: ', value);
      })
    // let responseStream = requestStream1
    //   .pipe(flatMap((val) => {
    //     return requestStream2;
    //   }))

    // let requestStream = Rx.Observable.merge(responseStream1, responseStream2);
    // var merged = Rx.Observable.merge(requestStream1, requestStream2)
    // responseStream.subscribe((value: any) => { //: Array<StorageProposal>
    //   console.log('value: ', value);
      // this.setState({
      //   democracyProposals: value.reduce((proposals: StateProposals, [propIdx, proposal, accountId]) => {
      //     const address = encodeAddress(accountId);

      //     if (!proposals[address]) {
      //       proposals[address] = [propIdx.toNumber()];
      //     } else {
      //       proposals[address].push(propIdx.toNumber());
      //     }

      //     return proposals;
      //   }, {} as StateProposals)
      // });
    // });
  }

  render () {
    // const { democracyProposals } = this.state;
    // console.log('democracyProposals: ', democracyProposals);

    return (
      <div>
        {/* Found {Object.keys(democracyProposals).length} accounts making democracyProposals. */}
      </div>
    );
  }
}

export default withApi(MultipleProposalsRxAPI);