// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Call } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React from 'react';
import styled from 'styled-components';

import { formatNumber, isString, isUndefined } from '@polkadot/util';

import CallDisplay from './Call';
import Expander from './Expander';
import { useTranslation } from './translate';
import TreasuryProposal from './TreasuryProposal';
import { isTreasuryProposalVote } from './util';

interface Props {
  className?: string;
  proposal?: Call | null;
  idNumber?: BN | number | string;
  withLinks?: boolean;
  expandNested?: boolean;
}

function ProposedAction ({ className = '', expandNested, idNumber, proposal, withLinks }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const stringId = isString(idNumber) || isUndefined(idNumber)
    ? idNumber
    : formatNumber(idNumber);

  if (!proposal) {
    return (
      <h3>{stringId ? `#${stringId}: ` : ''}{t<string>('No execution details available for this proposal')}</h3>
    );
  }

  const { meta, method, section } = proposal.registry.findMetaCall(proposal.callIndex);
  const header = `${stringId ? `#${stringId}: ` : ''}${section}.${method}`;

  return (
    <div className={`ui--ProposedAction ${className}`}>
      <h3>{header}</h3>
      <Expander summaryMeta={meta}>
        {(isTreasuryProposalVote(proposal) && expandNested)
          ? (
            <TreasuryProposal
              asInset={withLinks}
              insetProps={{
                withBottomMargin: true,
                withTopMargin: true,
                ...(withLinks ? { href: '/treasury' } : {})
              }}
              proposalId={proposal.args[0].toString()}
            />
          )
          : <CallDisplay value={proposal} />
        }
      </Expander>
    </div>
  );
}

export default React.memo(styled(ProposedAction)`
  margin-left: 2rem;

  .ui--ProposedAction-extrinsic {
    > .ui--Params-Content {
      padding-left: 0;
    }
  }

  .ui--ProposedAction-header {
    margin-bottom: 1rem;
  }
`);
