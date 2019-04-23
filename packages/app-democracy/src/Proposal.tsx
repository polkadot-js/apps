// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import BN from 'bn.js';
import React from 'react';
import { AccountId, Balance, Option, Proposal, Tuple, Vector } from '@polkadot/types';
import { AddressMini, Labelled, Static } from '@polkadot/ui-app';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { withCall, withMulti, withObservable } from '@polkadot/ui-api';
import { formatBalance } from '@polkadot/util';

import Item from './Item';
import Seconding from './Seconding';
import translate from './translate';

type Props = I18nProps & {
  allAccounts?: SubjectInfo,
  democracy_depositOf?: Option<Tuple>,
  idNumber: BN,
  value: Tuple
};

class ProposalDisplay extends React.PureComponent<Props> {
  render () {
    const { allAccounts, democracy_depositOf, idNumber, value } = this.props;

    const hasAccounts = allAccounts && Object.keys(allAccounts).length !== 0;

    if (!hasAccounts) {
      return null;
    }

    if (!democracy_depositOf || democracy_depositOf.isNone) {
      return null;
    }

    const depositOfs = democracy_depositOf.unwrap();
    const balance = depositOfs[0] as Balance;
    const addresses = depositOfs[1] as Vector<AccountId>;

    if (!addresses) {
      return null;
    }

    console.log('addresses', addresses.map(address => address.toString()));
    console.log('allAccounts', Object.keys(allAccounts as SubjectInfo));

    let addressesSet = new Set(addresses.map(address => address.toString()));
    let allAccountsSet = new Set(Object.keys(allAccounts as SubjectInfo));

    /**
     * Only allow addresses that have not already placed a deposit on the
     * proposal to second the proposal. The proposer places a deposit on
     * the proposal by creating it, and seconders place a matching deposit
     * on the propsal. So only list the subset of all accounts that
     * are not included in the list of account ids in the `depositOfs`
     * vector.
     */
    const addressesWithoutDepositOnProposal = Array.from(new Set(
      [...allAccountsSet].filter(x => !addressesSet.has(x))));

    return (
      <Item
        idNumber={idNumber}
        proposal={value[1] as Proposal}
        proposalExtra={this.renderExtra(balance, addresses)}
      >
        <Seconding
          addressesWithoutDepositOnProposal={(addressesWithoutDepositOnProposal as unknown) as Vector<AccountId>}
          propIndex={idNumber}
        />
      </Item>
    );
  }

  private renderExtra (balance: Balance, addresses: Vector<AccountId>) {
    const { t } = this.props;

    return (
      <div className='democracy--Proposal-info'>
        <Labelled label={t('depositors')}>
          <div>
            {addresses.map((address, index) => (
              <AddressMini
                isPadded={false}
                key={`${index}:${address}`}
                value={address}
              />
            ))}
          </div>
        </Labelled>
        <Static label={t('balance')}>
          {formatBalance(balance)}
        </Static>
      </div>
    );
  }
}

export default withMulti(
  ProposalDisplay,
  translate,
  withCall('query.democracy.depositOf', { paramName: 'idNumber' }),
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
