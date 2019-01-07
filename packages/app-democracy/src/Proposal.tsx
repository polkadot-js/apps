// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { AccountId, Balance, Proposal } from '@polkadot/types';
import { Tuple, Vector } from '@polkadot/types/codec';
import { AddressMini, Labelled, Static } from '@polkadot/ui-app/index';
import { withCall, withMulti } from '@polkadot/ui-react-rx/with/index';
import { balanceFormat } from '@polkadot/ui-react-rx/util/index';

import Item from './Item';
import translate from './translate';

type Props = I18nProps & {
  query_democracy_depositOf?: Tuple,
  idNumber: BN,
  value: Tuple
};

class ProposalDisplay extends React.PureComponent<Props> {
  render () {
    const { idNumber, value } = this.props;

    return (
      <Item
        idNumber={idNumber}
        proposal={value[1] as Proposal}
        proposalExtra={this.renderExtra()}
      />
    );
  }

  private renderExtra () {
    const { query_democracy_depositOf, t } = this.props;

    if (!query_democracy_depositOf) {
      return null;
    }

    const balance = query_democracy_depositOf[0] as Balance;
    const addresses = query_democracy_depositOf[1] as Vector<AccountId>;

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
  ProposalDisplay,
  translate,
  withCall('query.democracy.depositOf', { paramProp: 'idNumber' })
);
