// Copyright 2017-2018 @polkadot/app-example authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-react-rx/types';

import BN from 'bn.js';
import React from 'react';

import storage from '@polkadot/storage';
import createStorageKey from '@polkadot/storage/key';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import withApi from '@polkadot/ui-react-rx/with/api';
import storageTransform from '@polkadot/ui-react-rx/with/transform/storage';
import encodeAddress from '@polkadot/util-keyring/address/encode';
import u8aToBn from '@polkadot/util/u8a/toBn';

const balanceMethod = storage.staking.public.freeBalanceOf;
const intentionsMethod = storage.staking.public.intentions;
const proposalMethod = storage.democracy.public.proposals;
const validatorsMethod = storage.session.public.validators;

const ZERO = new BN(0);

type State = {
  balances: {
    [index: string]: BN
  },
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
      balances: {},
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
        const intentions = (transform(value, 0) as any[]).map(encodeAddress);

        this.setState({ intentions }, () => {
          this.subscribeBalances(intentions);
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
        const validators = (transform(value, 0) as any[]).map(encodeAddress);

        this.setState({ validators });
      });
  }

  subscribeBalances (accounts: string[]) {
    const { api } = this.props;
    const keyCreator = createStorageKey(balanceMethod);
    const { balances, subscriptions } = this.state;
    const newBalances = { ...balances };

    accounts.forEach((account) => {
      if (newBalances[account]) {
        return;
      } else {
        newBalances[account] = ZERO;
      }

      subscriptions.push(
        api.state
          // Here we pass a parameter to the key generator, so it points to the correct storage entry
          .getStorage(keyCreator(account))
          .subscribe((balance) => {
            this.setState(({ balances }: State) => {
              const newBalances = { ...balances };

              newBalances[account] = u8aToBn(balance, true);

              return {
                balances: newBalances
              };
            });
          })
      );
    });

    this.setState({
      balances: newBalances,
      subscriptions
    });
  }

  componentWillUnmount () {
    const { subscriptions } = this.state;

    subscriptions.forEach((sub) => sub.unsubscribe());
  }

  render () {
    const { balances, intentions, proposals, validators } = this.state;
    const sortedIntentions = intentions.sort((a, b) =>
      (balances[b] || ZERO).cmp(balances[a] || ZERO)
    );

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
          {sortedIntentions.map((address) => (
            this.renderAccount(address, balances[address], proposals[address], validators.includes(address))
          ))}
        </tbody>
      </table>
    );
  }

  renderAccount = (address: string, balance: BN = ZERO, proposals: number[] = [], isValidator: boolean = false) => {
    return (
      <tr className={isValidator ? 'validator' : ''} key={address}>
        <td><IdentityIcon size={24} value={address} /></td>
        <td>{address}</td>
        <td>{balance.toString(10)}</td>
        <td>{proposals.length}</td>
      </tr>
    );
  }
}

export default withApi(Comp);
