// Copyright 2017-2018 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { RxProposal, RxProposalDeposits } from '@polkadot/ui-react-rx/ApiObservable/types';

import BN from 'bn.js';
import React from 'react';
import AddressMini from '@polkadot/ui-app/AddressMini';
import Labelled from '@polkadot/ui-app/Labelled';
import Static from '@polkadot/ui-app/Static';
import classes from '@polkadot/ui-app/util/classes';
import withObservable from '@polkadot/ui-react-rx/with/observable';
import withMulti from '@polkadot/ui-react-rx/with/multi';
import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';

import Item from './Item';
import translate from './translate';

type Props = I18nProps & {
  democracyProposalDeposits?: RxProposalDeposits,
  idNumber: BN,
  value: RxProposal
};

class Proposal extends React.PureComponent<Props> {
  render () {
    const { className, idNumber, style, value } = this.props;

    return (
      <Item
        className={classes('democracy--Proposal', className)}
        idNumber={idNumber}
        proposal={value.proposal}
        proposalExtra={this.renderExtra()}
        style={style}
      >
        {this.renderVoting()}
      </Item>
    );
  }

  private renderExtra () {
    const { democracyProposalDeposits, t } = this.props;

    if (!democracyProposalDeposits) {
      return null;
    }

    const { balance, addresses } = democracyProposalDeposits;

    return (
      <div className='democracy--Proposal-info'>
        <Labelled label={t('proposal.depositsAddresses', {
          defaultValue: 'depositors'
        })}>
          <div>
            {addresses.map((address) => (
              <AddressMini
                isPadded={false}
                key={address}
                value={address}
              />
            ))}
          </div>
        </Labelled>
        <Static label={t('proposal.depositsBalanceLabel', {
          defaultValue: 'balance'
        })}>
          {numberFormat(balance)}
        </Static>
      </div>
    );
  }

  private renderVoting () {
    return null;
  }
}

export default withMulti(
  Proposal,
  translate,
  withObservable('democracyProposalDeposits', { paramProp: 'idNumber' })
);
