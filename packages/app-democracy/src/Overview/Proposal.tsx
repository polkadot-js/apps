/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance, Proposal } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { Option, Tuple, Vec } from '@polkadot/types';
import { ActionItem, InputAddress, Labelled, Static } from '@polkadot/ui-app';
import { withCalls, withMulti } from '@polkadot/ui-api';
import { formatBalance } from '@polkadot/util';

import translate from '../translate';
import Seconding from './Seconding';

interface Props extends I18nProps {
  democracy_depositOf?: [Balance, Vec<AccountId>] | null;
  idNumber: BN;
  value: Proposal;
}

class ProposalDisplay extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { className, democracy_depositOf, idNumber, value } = this.props;
    const depositors = democracy_depositOf
      ? democracy_depositOf[1]
      : [];

    return (
      <ActionItem
        className={className}
        idNumber={idNumber}
        proposal={value}
        accessory={
          <Seconding
            depositors={depositors}
            proposalId={idNumber}
          />
        }
      >
        {this.renderInfo()}
      </ActionItem>
    );
  }

  private renderInfo (): React.ReactNode {
    const { democracy_depositOf, t } = this.props;

    if (!democracy_depositOf) {
      return null;
    }

    const [balance, addresses] = democracy_depositOf;

    return (
      <div>
        <Labelled label={t('depositors')}>
          {addresses.map((address, index): React.ReactNode => (
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
      transform: (value: Option<Tuple>): Tuple | null =>
        value.unwrapOr(null)
    }]
  )
);
