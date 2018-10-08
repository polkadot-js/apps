// Copyright 2017-2018 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { RxProposal, RxProposalDeposits } from '@polkadot/api-observable/classes';

import BN from 'bn.js';
import React from 'react';
import AddressMini from '@polkadot/ui-app/AddressMini';
import Labelled from '@polkadot/ui-app/Labelled';
import Static from '@polkadot/ui-app/Static';
import withObservable from '@polkadot/ui-react-rx/with/observable';
import withMulti from '@polkadot/ui-react-rx/with/multi';
import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';

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
      >
        {this.renderVoting()}
      </Item>
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
        <Labelled label={t('proposal.depositsAddresses', {
          defaultValue: 'depositors'
        })}>
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

// //length
// 7902
// // version
// 81
// // prefix + senderId
// ffd172a74cda4c865912c32ba0a80a57ae69abae410e5ccb59dee84e2f4432db4f
// // signature
// 5efa3853d991456cb0c44affab49797bddebf3dbc5d5e142ebaa03c07128cef0
// 28550e474db927db24ec48653fb866a9372204ccf03ac5ef241dcace5bfc1f0a
// // nonce
// 0b00000000000000
// // era
// 00
// // callIndex (balances.transfer)
// 0100
// // prefix + recipientId
// ff3dbcd981952e5bcd4da4e8ee14d76b9a483d3898c76a2452a580d2dd6e5cc7fe
// // balance
// e8030000000000000000000000000000

// // length
// 5902
// // version
// 81
// // prefix + senderId
// ffd172a74cda4c865912c32ba0a80a57ae69abae410e5ccb59dee84e2f4432db4f
// // signature
// a43ffe3a72f0d729a63416e509addca9e5abfe2896031091f0e59a5ff8090e02
// 29f2e7033a9d1482175fce97c63b936a52058e532d1f21d5598dffad3098a70b
// // nonce
// 0b00000000000000
// // era
// 00
// // callIndex (democracy.propose)
// 0500
// // this is supposed to be consensus.setCode encoded
// 60010003
// // code length (20 << 2), i.e. 0b10100 << 2 = 0b1010000 = 0x50
// 50
// // actual bytes (20 bytes input file)
// 7b0a092230783432223a202230783433220a7d0a
// // balance
// e8030000000000000000000000000000

}

export default withMulti(
  Proposal,
  translate,
  withObservable('proposalDeposits', { paramProp: 'idNumber' })
);
