// Copyright 2017-2018 @polkadot/app-example authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-react-rx/types';

import BN from 'bn.js';
import React from 'react';

import storage from '@polkadot/storage';
import withApi from '@polkadot/ui-react-rx/with/api';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import Balance from '@polkadot/ui-react-rx/Balance';

type StorageProposal = [BN, any, string];
type StorageIntentions = Array<string>;
type StorageValidators = Array<string>;

type StateProposals = {
  [index: string]: number[]
};

type State = {
  intentions: Array<string>,
  proposals: StateProposals,
  subscriptions: Array<any>,
  validators: Array<string>
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

    return api.state
      .getStorage(storage.staking.public.intentions)
      .subscribe((intentions: StorageIntentions) => {
        this.setState({ intentions });
      });
  }

  subscribeProposals () {
    const { api } = this.props;

    return api.state
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

  subscribeValidators () {
    const { api } = this.props;

    return api.state
      .getStorage(storage.session.public.validators)
      .subscribe((validators: StorageValidators) => {
        this.setState({ validators });
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
