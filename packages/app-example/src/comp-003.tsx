// Copyright 2017-2018 @polkadot/app-example authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-react-rx/types';

import React from 'react';

import storage from '@polkadot/storage';
import createStorageKey from '@polkadot/storage/key';
import withApi from '@polkadot/ui-react-rx/with/api';
import storageTransform from '@polkadot/ui-react-rx/with/transform/storage';
import encodeAddress from '@polkadot/util-keyring/address/encode';

const method = storage.democracy.public.proposals;

type State = {
  proposals: {
    [index: string]: number[]
  }
};

class Comp extends React.PureComponent<ApiProps, State> {
  constructor (props: ApiProps) {
    super(props);

    this.state = {
      proposals: {}
    };
  }

  componentDidMount () {
    this.subscribeProposals();
  }

  // TODO We should unsubscribe from subscriptions
  subscribeProposals () {
    const { api } = this.props;
    const key = createStorageKey(method)();
    const transform = storageTransform(method);

    api.state
      .getStorage(key)
      .subscribe((value) => {
        this.setState({
          proposals: (transform(value, 0) as any[])
          .reduce((proposals, [propIdx, proposal, accountId]) => {
            const address = encodeAddress(accountId);

            if (!proposals[address]) {
              proposals[address] = [propIdx];
            } else {
              proposals[address].push(propIdx);
            }

            return proposals;
          }, {})
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
