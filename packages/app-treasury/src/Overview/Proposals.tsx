// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ProposalIndex } from '@polkadot/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { withCalls, withMulti } from '@polkadot/ui-api';
import { Button, Column } from '@polkadot/ui-app';

import Proposal from './Proposal';
import Propose from './Propose';
import translate from '../translate';

type Props = I18nProps & {
  isApprovals?: boolean,
  treasury_approvals?: Array<BN>,
  treasury_proposalCount?: BN
};

type State = {
  isProposeOpen: boolean,
  proposalIndices: Array<BN>
};

class ProposalsBase extends React.PureComponent<Props> {
  state: State = {
    isProposeOpen: false,
    proposalIndices: [] as Array<BN>
  };

  static getDerivedStateFromProps ({ isApprovals = false, treasury_approvals = [] as Array<BN>, treasury_proposalCount = new BN(0) }: Props) {
    let proposalIndices: Array<BN> = [];

    if (isApprovals) {
      proposalIndices = treasury_approvals;
    } else {
      for (let i = 0; i < treasury_proposalCount.toNumber(); i++) {
        proposalIndices.push(new BN(i));
      }
    }
    return { proposalIndices };
  }

  render () {
    const { isApprovals, t } = this.props;
    const { isProposeOpen } = this.state;

    return (
      <>
        <Column
          emptyText={t(isApprovals ? 'No approved proposals' : 'No pending proposals')}
          headerText={t(isApprovals ? 'Approved' : 'Proposals')}
          buttons={!isApprovals && (
            <Button.Group>
              <Button
                isPrimary
                label={t('Submit a spend proposal')}
                labelIcon='add'
                onClick={this.togglePropose(true)}
              />
            </Button.Group>
          )}
        >
          {this.renderProposals()}
        </Column>
        {!isApprovals && (
          <Propose
            isOpen={isProposeOpen}
            onClose={this.togglePropose(false)}
          />
        )}
      </>
    );
  }

  private renderProposals () {
    const { isApprovals } = this.props;
    const { proposalIndices } = this.state;

    return proposalIndices.map((proposalId) => (
      <Proposal
        isApproved={isApprovals}
        proposalId={proposalId.toString()}
        key={proposalId.toString()}
      />
    ));
  }

  private togglePropose = (isProposeOpen: boolean) => () => {
    this.setState({
      isProposeOpen
    });
  }
}

const Proposals = withMulti(
  styled(ProposalsBase as React.ComponentClass<Props, State>)`
    .treasury--Proposals-inner {
      display: flex;
      flex-wrap: column;
    }
  `,
  translate,
  withCalls<Props>(
    [
      'query.treasury.approvals',
      {
        transform: (value: Array<ProposalIndex>) => value.map((proposalId) => new BN(proposalId))
      }
    ],
    'query.treasury.proposalCount'
  )
);

export default Proposals;
export const Approvals = () => <Proposals isApprovals />;
