// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { AccountId, Balance, Proposal, Tuple, Vector } from '@polkadot/types';
import { AddressMini, Labelled, Static } from '@polkadot/ui-app/index';
import { withCall, withMulti } from '@polkadot/ui-api/index';
import { formatBalance } from '@polkadot/ui-util';

import Item from './Item';
import translate from './translate';

type Props = I18nProps & {
  democracy_depositOf?: Tuple,
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

    if (!democracy_depositOf) {
      return null;
    }

    const balance = democracy_depositOf[0] as Balance;
    const addresses = democracy_depositOf[1] as Vector<AccountId>;

    return (
      <div className='democracy--Proposal-info'>
        <Labelled label={t('depositors')}>
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
