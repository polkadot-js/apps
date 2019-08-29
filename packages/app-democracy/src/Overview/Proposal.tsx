/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance, Proposal as ProposalType } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import { Option, Tuple, Vec } from '@polkadot/types';
import { ActionItem, InputAddress, Labelled, Static } from '@polkadot/react-components';
import { withCalls, withMulti } from '@polkadot/react-api';
import { formatBalance } from '@polkadot/util';

import translate from '../translate';
import Seconding from './Seconding';

interface Props extends I18nProps {
  democracy_depositOf?: [Balance, Vec<AccountId>] | null;
  idNumber: BN;
  value: ProposalType;
}

function renderProposal ({ democracy_depositOf, t }: Props): React.ReactNode {
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

function Proposal (props: Props): React.ReactElement<Props> {
  const { className, democracy_depositOf, idNumber, value } = props;
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
      {renderProposal(props)}
    </ActionItem>
  );
}

export default withMulti(
  Proposal,
  translate,
  withCalls<Props>(
    ['query.democracy.depositOf', {
      paramName: 'idNumber',
      transform: (value: Option<Tuple>): Tuple | null =>
        value.unwrapOr(null)
    }]
  )
);
