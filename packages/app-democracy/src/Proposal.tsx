// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { AccountId, Balance, Option, Proposal, Tuple, Vector } from '@polkadot/types';
import { AddressMini, Labelled, Static } from '@polkadot/ui-app';
import { withCall, withMulti } from '@polkadot/ui-api';
import { formatBalance } from '@polkadot/util';

import Item from './Item';
import translate from './translate';

type Props = I18nProps & {
  democracy_depositOf?: Option<Tuple>,
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
    const { democracy_depositOf, t } = this.props;

    if (!democracy_depositOf || democracy_depositOf.isNone) {
      return null;
    }

    const value = democracy_depositOf.unwrap();
    const balance = value[0] as Balance;
    const addresses = value[1] as Vector<AccountId>;

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
  withCall('query.democracy.depositOf', { paramName: 'idNumber' })
);
