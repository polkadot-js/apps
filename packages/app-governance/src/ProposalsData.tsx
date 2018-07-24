// Copyright 2017-2018 @polkadot/app-example authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-react-rx/types';

import BN from 'bn.js';
import React from 'react';

import storage from '@polkadot/storage';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import withApi from '@polkadot/ui-react-rx/with/api';
import encodeAddress from '@polkadot/util-keyring/address/encode';

type StorageProposal = [BN, any, Uint8Array];
type StorageIntentions = Array<Uint8Array>;
type StorageValidators = Array<Uint8Array>;

type StateBalances = {
  [index: string]: BN
};

type StateProposals = {
  [index: string]: number[]
};

// accountId: referendum/proposal index's
type StateVotesFor = {
  [index: string]: Array<number>
};

type State = {
  balances: StateBalances,
  intentions: Array<string>,
  proposals: StateProposals,
  subscriptions: Array<any>,
  validators: Array<string>,
  votesFor: StateVotesFor
};

const ZERO = new BN(0);

class ProposalsData extends React.PureComponent<ApiProps, State> {
  constructor (props: ApiProps) {
    super(props);

    this.state = {
      balances: {},
      intentions: [],
      proposals: {},
      subscriptions: [],
      validators: [],
      votesFor: {}
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
      .subscribe((storage: StorageIntentions) => {
        const intentions = storage.map(encodeAddress);

        this.setState({ intentions }, () => {
          this.subscribeBalances(intentions);
        });
      });
  }

  subscribeProposals () {
    const { api } = this.props;

    return api.state
      .getStorage(storage.democracy.public.proposals)
      .subscribe((value: Array<StorageProposal>) => {
        this.setState({
          proposals: value.reduce((proposals: StateProposals, [propIdx, proposal, accountId]) => {
            const address = encodeAddress(accountId);

            if (!proposals[address]) {
              proposals[address] = [propIdx.toNumber()];
            } else {
              proposals[address].push(propIdx.toNumber());
            }

            this.subscribeVotesFor(proposals);

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
        this.setState({
          validators: validators.map(encodeAddress)
        });
      });
  }

  subscribeVotesFor (proposals: StateProposals) {
    const { api } = this.props;
    const { votesFor, subscriptions } = this.state;
    const newVotesFor: StateVotesFor = { ...votesFor };

    console.log('proposals: ', proposals);

    for (let address in proposals) {
      console.log('address in proposals hash: ', address);

      for (let propIdx of proposals[address]) {
        console.log('propIdx in proposals[address] array: ', propIdx);

        subscriptions.push(
          api.state
            .getStorage(storage.democracy.public.votersFor, propIdx)
            .subscribe((addresses: Array<string>) => {
              console.log('subscribe returned addresses: ', addresses);

              this.setState(({ votesFor }: State) => {

                for (let address of addresses) {
                  if (newVotesFor[address]) {
                    // update the array of proposal indexes that an address has voted for if it exists
                    newVotesFor[address].push(propIdx);
                  } else {
                    // add new key with the address to the hash if it has not voted before
                    newVotesFor[address] = [];
                  }
                }
                console.log('setting newVotesFor state: ', newVotesFor);

                return {
                  votesFor: newVotesFor
                };
              });
            })
        );
      }
    };

    this.setState({
      votesFor: newVotesFor,
      subscriptions
    });
  }

  subscribeBalances (accounts: string[]) {
    const { api } = this.props;
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
          .getStorage(storage.staking.public.freeBalanceOf, account)
          .subscribe((balance: BN) => {
            this.setState(({ balances }: State) => {
              const newBalances = { ...balances };

              newBalances[account] = balance;

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
    const { balances, intentions, proposals, validators, votesFor } = this.state;
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
            <th>VotesFor</th>
          </tr>
        </thead>
        <tbody>
          {sortedIntentions.map((address) => (
            this.renderAccount(address, balances[address], proposals[address], validators.includes(address), votesFor[address])
          ))}
        </tbody>
      </table>
    );
  }

  renderAccount = (address: string, balance: BN = ZERO, proposalIndexes: number[] = [], isValidator: boolean = false, votes: Array<number> = []) => {
    return (
      <tr className={isValidator ? 'validator' : ''} key={address}>
        <td><IdentityIcon size={24} value={address} /></td>
        <td>{address}</td>
        <td>{balance.toString(10)}</td>
        <td>
          Proposals Quantity: {proposalIndexes.length}
          <br />
          Proposals Indexes: {proposalIndexes.join(', ') }
        </td>
        <td>
          Votes Quantity: {votes.length}
          <br />
          Votes For Proposal Indexes: {votes.map((pIdx) => pIdx).join(', ') }
        </td>
      </tr>
    );
  }
}

export default withApi(ProposalsData);
