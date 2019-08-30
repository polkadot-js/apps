// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Proposal } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { GenericCall } from '@polkadot/types';
import { formatNumber } from '@polkadot/util';

import Call from './Call';
import Inset, { InsetProps } from './Inset';
import TreasuryProposal from './TreasuryProposal';
import { isTreasuryProposalVote } from './util';

interface Props {
  className?: string;
  asInset?: boolean;
  insetProps?: Partial<InsetProps>;
  proposal?: Proposal | null;
  idNumber: BN | number | string;
  isCollapsible?: boolean;
  withLinks?: boolean;
  expandNested?: boolean;
}

export const styles = `
  .ui--ProposedAction-extrinsic {
    margin-bottom: 1rem;

    .ui--Params-Content {
      padding-left: 0;
    }
  }

  .ui--ProposedAction-header {
    margin-bottom: 1rem;
  }
`;

function ProposedAction (props: Props): React.ReactElement<Props> {
  const { asInset, insetProps, isCollapsible, proposal, withLinks, expandNested } = props;
  const idNumber = typeof props.idNumber === 'string'
    ? props.idNumber
    : formatNumber(props.idNumber);

  if (!proposal) {
    return (
      <h3>#{idNumber}</h3>
    );
  }

  const { meta, method, section } = GenericCall.findFunction(proposal.callIndex);

  const header = `#${idNumber}: ${section}.${method}`;
  const documentation = (meta && meta.documentation)
    ? (
      <summary>{meta.documentation.join(' ')}</summary>
    )
    : null;
  const params = (isTreasuryProposalVote(proposal) && expandNested) ? (
    <TreasuryProposal
      className='ui--ProposedAction-extrinsic'
      asInset={withLinks}
      insetProps={{
        withTopMargin: true,
        withBottomMargin: true,
        ...(withLinks ? { href: '/treasury' } : {})
      }}
      proposalId={proposal.args[0].toString()}
    />
  ) : (
    <Call
      className='ui--ProposedAction-extrinsic'
      value={proposal}
    />
  );

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
    <>
      <h3>{header}</h3>
      {isCollapsible
        ? (
          <details>
            {documentation}
            {params}
          </details>
        )
        : (
          <>
            <details>
              {documentation}
            </details>
            {params}
          </>
        )}
    </>
  );
}

export default styled(ProposedAction)`${styles}`;
