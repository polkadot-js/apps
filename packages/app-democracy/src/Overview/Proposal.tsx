// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { AccountId, Balance, Option, Proposal, Tuple, Vector } from '@polkadot/types';
import { InputAddress, Labelled, Static } from '@polkadot/ui-app';
import { withCalls, withMulti } from '@polkadot/ui-api';
import { formatBalance } from '@polkadot/util';

import translate from '../translate';
import Item from './Item';
import Seconding from './Seconding';

type Props = I18nProps & {
  democracy_depositOf?: [Balance, Vector<AccountId>] | null,
  idNumber: BN,
  value: Proposal
};

class ProposalDisplay extends React.PureComponent<Props> {
  render () {
    const { className, democracy_depositOf, idNumber, value } = this.props;
    const depositors = democracy_depositOf
      ? democracy_depositOf[1]
      : [];

    return (
      <Item
        className={className}
        idNumber={idNumber}
        proposal={value}
        proposalExtra={this.renderExtra()}
      >
        <Seconding
          depositors={depositors}
          proposalId={idNumber}
        />
      </Item>
    );
  }

  private renderExtra () {
    const { democracy_depositOf, t } = this.props;

    if (!democracy_depositOf) {
      return null;
    }

    const [balance, addresses] = democracy_depositOf;

    return (
      <div>
        <Labelled label={t('depositors')}>
          {addresses.map((address, index) => (
            <InputAddress
              isDisabled
              key={`${index}:${address}`}
              value={address}
              withLabel={false}
            />
          ))}
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
  withCalls<Props>(
    ['query.democracy.depositOf', {
      paramName: 'idNumber',
      transform: (value: Option<Tuple>) =>
        value.unwrapOr(null)
    }]
  )
);
