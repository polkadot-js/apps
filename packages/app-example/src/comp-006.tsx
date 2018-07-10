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
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import Balance from '@polkadot/ui-react-rx/Balance';

const intentionsMethod = storage.staking.public.intentions;
const proposalMethod = storage.democracy.public.proposals;
const validatorsMethod = storage.session.public.validators;

type State = {
  intentions: string[],
  proposals: {
    [index: string]: number[]
  },
  subscriptions: any[],
  validators: string[]
};

class Comp extends React.PureComponent<ApiProps, State> {
  constructor (props: ApiProps) {
    super(props);

    this.state = {
      intentions: [],
      proposals: {},
      subscriptions: [],
      validators: []
    };
  }

  componentDidMount () {
    this.setState({
      subscriptions: [
        this.subscribeIntentions(),
        this.subscribeProposals(),
        this.subscribeValidators()
      ]
    });
  }

  subscribeIntentions () {
    const { api } = this.props;
    const key = createStorageKey(intentionsMethod)();
    const transform = storageTransform(intentionsMethod);

    return api.state
      .getStorage(key)
      .subscribe((value) => {
        this.setState({
          intentions: (transform(value, 0) as any[]).map(encodeAddress)
        });
      });
  }

  subscribeProposals () {
    const { api } = this.props;
    const key = createStorageKey(proposalMethod)();
    const transform = storageTransform(proposalMethod);

    return api.state
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

  subscribeValidators () {
    const { api } = this.props;
    const key = createStorageKey(validatorsMethod)();
    const transform = storageTransform(validatorsMethod);

    return api.state
      .getStorage(key)
      .subscribe((value) => {
        this.setState({
          validators: (transform(value, 0) as any[]).map(encodeAddress)
        });
      });
  }

  componentWillUnmount () {
    const { subscriptions } = this.state;

    subscriptions.forEach((sub) => sub.unsubscribe());
  }

  render () {
    const { intentions, proposals, validators } = this.state;

    return (
      <table className='accounts'>
        <thead>
          <tr>
            <th />
            <th>Address</th>
            <th>Balance</th>
            <th>Proposals</th>
          </tr>
        </thead>
        <tbody>
          {intentions.map((address) => (
            this.renderAccount(address, proposals[address], validators.includes(address))
          ))}
        </tbody>
      </table>
    );
  }

  renderAccount = (address: string, proposals: number[] = [], isValidator: boolean = false) => {
    return (
      <tr className={isValidator ? 'validator' : ''} key={address}>
        <td><IdentityIcon size={24} value={address} /></td>
        <td>{address}</td>
        <td><Balance params={address} /></td>
        <td>{proposals.length}</td>
      </tr>
    );
  }
}

export default withApi(Comp);
