// Copyright 2017-2018 @polkadot/app-governance authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-react-rx/types';

import BN from 'bn.js';
import React from 'react';

import storage from '@polkadot/storage';
import withApi from '@polkadot/ui-react-rx/with/api';
import encodeAddress from '@polkadot/util-keyring/address/encode';
import { mergeMap } from 'rxjs/operators';

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

  componentDidMount () {
    this.setState({
      subscriptions: [
        this.subscribeProposals(),
        // this.subscribeNextTally(),
        // this.subscribeReferendumCount(),
        this.subscribeBothNextTallyAndReferendumCount()
        // ,
        // this.subscribeReferendumInfoOf() // called by other function
      ]
    });
  }

  subscribeBothNextTallyAndReferendumCount () {
    const { api } = this.props;

    const nt = storage.democracy.public.nextTally;
    const rc = storage.democracy.public.referendumCount;

    let requestStream1 = api.state.getStorage(rc);
    let requestStream2 = api.state.getStorage(nt);

    requestStream1
      .pipe(mergeMap((referendumCount: BN) => {
        console.log('rc: ', referendumCount.toNumber());
        this.setState({
          referendumCount: referendumCount.toNumber()
        });
        return requestStream2;
      }))
      .subscribe((nextTally: BN) => {
        console.log('nt: ', nextTally.toNumber());
        this.setState({
          nextTally: nextTally.toNumber()
        });

        console.log('calling subscribeReferendumInfoOf');
        // this.setState({ intentions }, () => {
        this.subscribeReferendumInfoOf(this.state.nextTally, this.state.referendumCount);
        // });
      });
  }

  subscribeProposals () {
    const { api } = this.props;

    api.state
      .getStorage(storage.democracy.public.proposals)
      .subscribe((value: Array<StorageProposal>) => {
        console.log('proposals: ', value);
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

  // subscribeNextTally () {
  //   const { api } = this.props;

  //   api.state
  //     .getStorage(storage.democracy.public.nextTally)
  //     .subscribe((value: BN) => {
  //       console.log('nextTally: ', value);
  //       this.setState({
  //         nextTally: value.toNumber()
  //       });
  //     });
  // }

  // subscribeReferendumCount () {
  //   const { api } = this.props;

  //   api.state
  //     .getStorage(storage.democracy.public.referendumCount)
  //     .subscribe((value: BN) => {
  //       console.log('referendumCount: ', value);
  //       this.setState({
  //         referendumCount: value.toNumber()
  //       });
  //     });
  // }

  subscribeReferendumInfoOf (nextTally: number, referendumCount: number) {
    const { api } = this.props;

    // Create array filled with values containing the Referendum Id's to subscribe to
    // https://davidwalsh.name/fill-array-javascript
    const fillRange = (start: number, end: number) => {
      return [...Array(end - start + 1)].map((item, index) => start + index);
    };

    const referendumIdsToSubscribeTo = fillRange(nextTally - 1, referendumCount - 1);

    const { referendumInfoOf } = this.state;

    referendumIdsToSubscribeTo.forEach((referendumId) => {
      api.state
        .getStorage(storage.democracy.public.referendumInfoOf, referendumId)
        .subscribe((referendumInfoForGivenId: any) => {
          referendumInfoOf[referendumId] = referendumInfoForGivenId;

          console.log('this.state.referendumInfos updated to: ', referendumInfoOf);
          this.setState({
            referendumInfoOf: referendumInfoOf
          });
        });
    });
  }

  componentWillUnmount () {
    const { subscriptions } = this.state;

    subscriptions.forEach((sub) => sub.unsubscribe());
  }

  render () {
    const { proposals, nextTally, referendumCount, referendumInfoOf } = this.state;
    console.log('proposals: ', proposals);
    console.log('nextTally: ', nextTally);
    console.log('referendumCount: ', referendumCount);
    console.log('referendumInfoOf: ', referendumInfoOf);

    const showReferendumInfoOf = (referendumInfoOf: any) => {
      return (
        Object.keys(referendumInfoOf).forEach(function (key: any, value: any) {
          return `key: ${key}, value: ${value}`;
        })
      );
    };

    return (
      <div>
        <div>Found {Object.keys(proposals).length} accounts making proposals.</div>
        <div>Next tally (next Referendum ID to be tallied) {nextTally}.</div>
        <div>Referendum Count is {referendumCount}.</div>
        <div>Referendum Info Of KV pairs are: {showReferendumInfoOf(referendumInfoOf)}</div>
      </div>
    );
  }
}

export default withApi(Test);
