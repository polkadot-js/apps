// Copyright 2017-2018 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { RxProposal, RxProposalDeposits } from '@polkadot/api-observable/classes';

import BN from 'bn.js';
import React from 'react';
import { AddressMini, Labelled, Static } from '@polkadot/ui-app/index';
import { withMulti, withObservable } from '@polkadot/ui-react-rx/with/index';
import { balanceFormat } from '@polkadot/ui-react-rx/util/index';

import Item from './Item';
import translate from './translate';

type Props = I18nProps & {
  proposalDeposits?: RxProposalDeposits,
  idNumber: BN,
  value: RxProposal
};

class Proposal extends React.PureComponent<Props> {
  render () {
    const { idNumber, value } = this.props;

    return (
      <Item
        idNumber={idNumber}
        proposal={value.proposal}
        proposalExtra={this.renderExtra()}
      />
    );
  }

  private renderExtra () {
    const { proposalDeposits, t } = this.props;

    if (!proposalDeposits) {
      return null;
    }

    const { balance, addresses } = proposalDeposits;

    return (
      <div className='democracy--Proposal-info'>
        <Labelled
          label={t('proposal.depositsAddresses', {
            defaultValue: 'depositors'
          })}
        >
          <div>
            {addresses.map((address) => (
              <AddressMini
                isPadded={false}
                key={address.toString()}
                value={address}
              />
            ))}
          </div>
        </Labelled>
        <Static
          label={t('proposal.depositsBalanceLabel', {
            defaultValue: 'balance'
          })}
        >
          {balanceFormat(balance)}
        </Static>
      </div>
    );
  }
}

export default withMulti(
  Proposal,
  translate,
  withObservable('proposalDeposits', { paramProp: 'idNumber' })
);
