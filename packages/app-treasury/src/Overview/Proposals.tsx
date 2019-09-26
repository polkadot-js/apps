/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProposalIndex } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { withCalls, withMulti } from '@polkadot/react-api';
import { Column } from '@polkadot/react-components';

import Proposal from './Proposal';
import translate from '../translate';

interface Props extends I18nProps, RouteComponentProps<{}> {
  isApprovals?: boolean;
  treasury_approvals?: BN[];
  treasury_proposalCount?: BN;
}

function ProposalsBase ({ history, isApprovals = false, treasury_approvals, treasury_proposalCount, t }: Props): React.ReactElement<Props> {
  const [isEmpty, setIsEmpty] = useState(true);
  const [proposalIndices, setProposalIndices] = useState<BN[]>([]);

  useEffect((): void => {
    let proposalIndices: BN[] = [];

    if (isApprovals) {
      proposalIndices = treasury_approvals || [];
    } else if (treasury_proposalCount && treasury_approvals) {
      for (let i = 0; i < treasury_proposalCount.toNumber(); i++) {
        if (!treasury_approvals.find((index): boolean => index.eqn(i))) {
          proposalIndices.push(new BN(i));
        }
      }
    }

    setProposalIndices(proposalIndices);
  }, [isApprovals, treasury_approvals, treasury_approvals]);

  const _onRespond = (): void => {
    history.push('/council/motions');
  };
  const _onPopulateProposal = (): void => {
    isEmpty && setIsEmpty(false);
  };

  return (
    <>
      <Column
        emptyText={isApprovals ? t('No approved proposals') : t('No pending proposals')}
        headerText={isApprovals ? t('Approved') : t('Proposals')}
        isEmpty={isEmpty}
      >
        {proposalIndices.map((proposalId): React.ReactNode => (
          <Proposal
            isApproved={isApprovals}
            onPopulate={_onPopulateProposal}
            onRespond={_onRespond}
            proposalId={proposalId.toString()}
            key={proposalId.toString()}
          />
        ))}
      </Column>
    </>
  );
}

const Proposals = withMulti(
  withRouter(ProposalsBase),
  translate,
  withCalls<Props>(
    ['query.treasury.approvals', {
      transform: (value: ProposalIndex[]): BN[] =>
        value.map((proposalId): BN => new BN(proposalId))
    }],
    'query.treasury.proposalCount'
  )
);

export default Proposals;

export function Approvals (): React.ReactElement<{}> {
  return <Proposals isApprovals />;
}
