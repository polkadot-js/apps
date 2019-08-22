// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TreasuryProposal as TreasuryProposalType } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import React from 'react';
import styled from 'styled-components';
import { Option } from '@polkadot/types';
import { ActionItem, Icon, TreasuryProposal } from '@polkadot/react-components';
import { withCalls, withMulti, withObservable } from '@polkadot/react-api';
import keyring from '@polkadot/ui-keyring';

import translate from '../translate';
import Approve from './Approve';

const Approved = styled.h3`
  color: green;
  margin: 0;
`;

interface Props extends I18nProps {
  allAccounts?: SubjectInfo;
  isApproved: boolean;
  proposal?: TreasuryProposalType | null;
  proposalId: string;
  onPopulate: () => void;
  onRespond: () => void;
}

interface State {
  isApproveOpen: boolean;
}

class ProposalDisplay extends React.PureComponent<Props, State> {
  public constructor (props: Props) {
    super(props);

    const { proposal, onPopulate } = props;
    if (proposal) {
      onPopulate();
    }
  }

  public componentDidUpdate ({ proposal }: Props): void {
    const { onPopulate } = this.props;

    if (this.props.proposal && !proposal) {
      onPopulate();
    }
  }

  public state: State = {
    isApproveOpen: false
  };

  public render (): React.ReactNode {
    const { proposal, proposalId } = this.props;

    if (!proposal) {
      return null;
    }

    return (
      <ActionItem
        accessory={this.renderAccessory()}
        idNumber={proposalId}
      >
        <TreasuryProposal proposal={proposal} />
      </ActionItem>
    );
  }

  private renderAccessory (): React.ReactNode {
    const { allAccounts, isApproved, onRespond, proposal, proposalId, t } = this.props;

    if (isApproved) {
      return (
        <Approved>
          <Icon name='check' />
          {'  '}
          {t('Approved')}
        </Approved>
      );
    }

    const hasAccounts = allAccounts && Object.keys(allAccounts).length !== 0;
    if (!hasAccounts) {
      return null;
    }

    return (
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
    );
  }
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
  ),
  withObservable(keyring.accounts.subject, { propName: 'allAccounts' })
);
