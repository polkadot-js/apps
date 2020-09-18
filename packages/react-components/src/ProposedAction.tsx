// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Proposal } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { formatNumber, isString } from '@polkadot/util';

import Call from './Call';
import Expander from './Expander';
import Inset, { InsetProps } from './Inset';
import TreasuryProposal from './TreasuryProposal';
import { isTreasuryProposalVote } from './util';

interface Props {
  className?: string;
  asInset?: boolean;
  insetProps?: Partial<InsetProps>;
  proposal?: Proposal | null;
  idNumber: BN | number | string;
  withLinks?: boolean;
  expandNested?: boolean;
}

export const styles = `
  margin-left: 2rem;

  .ui--ProposedAction-extrinsic {
    .ui--Params-Content {
      padding-left: 0;
    }
  }

  .ui--ProposedAction-header {
    margin-bottom: 1rem;
  }
`;

function ProposedAction ({ asInset, className = '', expandNested, idNumber, insetProps, proposal, withLinks }: Props): React.ReactElement<Props> {
  const stringId = isString(idNumber)
    ? idNumber
    : formatNumber(idNumber);

  if (!proposal) {
    return (
      <h3>#{stringId}</h3>
    );
  }

  const { meta, method, section } = proposal.registry.findMetaCall(proposal.callIndex);

  const header = `#${stringId}: ${section}.${method}`;
  const documentation = meta?.documentation
    ? (
      <summary>{meta.documentation.join(' ')}</summary>
    )
    : null;
  const params = (isTreasuryProposalVote(proposal) && expandNested)
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
    : <Call value={proposal} />;

  if (asInset) {
    return (
      <Inset
        header={header}
        isCollapsible
        {...insetProps}
      >
        <>
          {documentation}
          {params}
        </>
      </Inset>
    );
  }

  return (
    <div className={`ui--ProposedAction ${className}`}>
      <h3>{header}</h3>
      <Expander summaryMeta={meta}>
        {params}
      </Expander>
    </div>
  );
}

export default React.memo(styled(ProposedAction)`${styles}`);
