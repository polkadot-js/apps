/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProposalIndex } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useApi, useStream } from '@polkadot/react-hooks';
import { Table } from '@polkadot/react-components';

import Proposal from './Proposal';
import translate from '../translate';

interface Props extends I18nProps {
  isApprovals?: boolean;
}

function ProposalsBase ({ className, isApprovals, t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const approvalIds = useStream<ProposalIndex[]>(api.query.treasury.approvals, []);
  const proposalCount = useStream<BN>(api.query.treasury.proposalCount, []);
  const history = useHistory();
  const [isEmpty, setIsEmpty] = useState(true);
  const [proposalIndices, setProposalIndices] = useState<BN[]>([]);

  useEffect((): void => {
    let proposalIndices: BN[] = [];

    if (isApprovals) {
      proposalIndices = approvalIds || [];
    } else if (proposalCount && approvalIds) {
      for (let i = 0; i < proposalCount.toNumber(); i++) {
        if (!approvalIds.find((index): boolean => index.eqn(i))) {
          proposalIndices.push(new BN(i));
        }
      }
    }

    setProposalIndices(proposalIndices);
  }, [isApprovals, proposalCount, approvalIds]);

  const _onRespond = (): void => {
    history.push('/council/motions');
  };
  const _onPopulateProposal = (): void => {
    isEmpty && setIsEmpty(false);
  };

  return (
    <div className={className}>
      <h1>{isApprovals ? t('Approved') : t('Proposals')}</h1>
      {isEmpty && (
        isApprovals ? t('No approved proposals') : t('No pending proposals')
      )}
      <Table>
        <Table.Body>
          {proposalIndices.map((proposalId): React.ReactNode => (
            <Proposal
              isApproved={isApprovals}
              onPopulate={_onPopulateProposal}
              onRespond={_onRespond}
              proposalId={proposalId}
              key={proposalId.toString()}
            />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

const Proposals = translate(ProposalsBase);

export default Proposals;

export function Approvals (): React.ReactElement<{}> {
  return <Proposals isApprovals />;
}
