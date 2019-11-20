// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TreasuryProposal as TreasuryProposalType } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Option } from '@polkadot/types';
import { ActionItem, Icon, TreasuryProposal } from '@polkadot/react-components';
import { withCalls, withMulti } from '@polkadot/react-api';
import { useAccounts } from '@polkadot/react-hooks';

import translate from '../translate';
import Approve from './Approve';

const Approved = styled.h3`
  color: green;
  margin: 0;
`;

interface Props extends I18nProps {
  isApproved: boolean;
  proposal?: TreasuryProposalType | null;
  proposalId: string;
  onPopulate: () => void;
  onRespond: () => void;
}

function ProposalDisplay ({ isApproved, onPopulate, onRespond, proposal, proposalId, t }: Props): React.ReactElement<Props> | null {
  const { hasAccounts } = useAccounts();

  useEffect((): void => {
    onPopulate();
  }, [proposal]);

  if (!proposal) {
    return null;
  }

  return (
    <ActionItem
      accessory={
        isApproved
          ? (
            <Approved>
              <Icon name='check' />
              {'  '}
              {t('Approved')}
            </Approved>
          )
          : hasAccounts
            ? (
              <Approve
                proposalInfo={
                  <>
                    <h3>Proposal #{proposalId}</h3>
                    <details>
                      <TreasuryProposal proposal={proposal} />
                    </details>
                    <br />
                  </>
                }
                proposalId={proposalId}
                onSuccess={onRespond}
              />
            )
            : null
      }
      idNumber={proposalId}
    >
      <TreasuryProposal proposal={proposal} />
    </ActionItem>
  );
}

export default withMulti(
  ProposalDisplay,
  translate,
  withCalls<Props>(
    ['query.treasury.proposals', {
      paramName: 'proposalId',
      propName: 'proposal',
      transform: (value: Option<TreasuryProposalType>): TreasuryProposalType | null =>
        value.unwrapOr(null)
    }]
  )
);
