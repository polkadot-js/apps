// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Method, Proposal } from '@polkadot/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { formatNumber } from '@polkadot/util';

import Call from './Call';
import Inset, { InsetProps } from './Inset';
import TreasuryProposal from './TreasuryProposal';
import { isTreasuryProposalVote } from './util';

type Props = {
  className?: string,
  asInset?: boolean,
  insetProps?: Partial<InsetProps>,
  proposal?: Proposal | null,
  idNumber: BN | number | string,
  withLinks?: boolean,
  expandNested?: boolean
};

export const styles = `
  .ui--ProposedAction-extrinsic {
    margin-top: 1rem;

    .ui--Params-Content {
      padding-left: 0;
    }
  }

  .ui--ProposedAction-header {
    margin-bottom: 1rem;
  }
`;

class ProposedAction extends React.PureComponent<Props> {
  render () {
    const { asInset, insetProps, proposal, withLinks, expandNested } = this.props;

    const idNumber = typeof this.props.idNumber === 'string'
      ? this.props.idNumber
      : formatNumber(this.props.idNumber);

    if (!proposal) {
      return (
        <h3>#{idNumber}</h3>
      );
    }

    const { meta, method, section } = Method.findFunction(proposal.callIndex);

    const header = `#${idNumber}: ${section}.${method}`;
    const documentation = (meta && meta.documentation)
      ? (
        <details>
          <summary>{meta.documentation.join(' ')}</summary>
        </details>
      )
      : null;
    const params = (isTreasuryProposalVote(proposal) && expandNested) ? (
      <TreasuryProposal
        className='ui--ProposedAction-inset'
        asInset
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
        {documentation}
        {params}
      </>
    );
  }
}

export default styled(ProposedAction as React.ComponentClass<Props>)`${styles}`;
