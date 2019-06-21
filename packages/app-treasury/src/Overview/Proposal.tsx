// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import React from 'react';
import { Option, TreasuryProposal } from '@polkadot/types';
import { Button, Icon, InputAddress, Labelled, Static } from '@polkadot/ui-app';
import { withCalls, withMulti, withObservable } from '@polkadot/ui-api';
import keyring from '@polkadot/ui-keyring';
import { formatBalance } from '@polkadot/util';

import translate from '../translate';
import Item from './Item';
import Approve from './Approve';

type Props = I18nProps & {
  allAccounts?: SubjectInfo,
  isApproved: boolean,
  proposal?: TreasuryProposal | null,
  proposalId: string
};

type State = {
  isApproveOpen: boolean,
  isApproving: boolean | null
};

class ProposalDisplay extends React.PureComponent<Props, State> {
  state: State = {
    isApproveOpen: false,
    isApproving: null
  };

  render () {
    const { isApproved, proposal, proposalId } = this.props;

    if (!proposal) {
      return null;
    }

    return (
      <Item
        isApproved={isApproved}
        proposal={proposal}
        proposalExtra={this.renderExtra()}
        proposalId={proposalId}
      >
        {this.renderAccessory()}
      </Item>
    );
  }

  private renderAccessory () {
    const { allAccounts, isApproved, proposalId, t } = this.props;
    const { isApproveOpen, isApproving } = this.state;

    if (isApproved) {
      return (
        <h3 className='treasury--Approve-approved'>
          <Icon name='check' />
          {'  '}
          {t('Approved')}
        </h3>
      );
    }

    const hasAccounts = allAccounts && Object.keys(allAccounts).length !== 0;
    if (!hasAccounts) {
      return null;
    }

    return (
      <>
        <div className='ui--Row-buttons'>
          <Button.Group>
            <Button
              isPrimary
              label={t('Approve')}
              labelIcon='check'
              onClick={this.showApprove(true)}
            />
            <Button.Or />
            <Button
              isNegative
              label={t('Reject')}
              labelIcon='ban sign'
              onClick={this.showApprove(false)}
            />
          </Button.Group>
        </div>
        <Approve
          isApproving={isApproving}
          isOpen={isApproveOpen}
          onClose={this.hideApprove}
          proposalInfo={this.renderExtra()}
          proposalId={proposalId}
        />
      </>
    );
  }

  private renderExtra () {
    const { isApproved, proposal, t } = this.props;

    if (!proposal) {
      return null;
    }

    const { bond, beneficiary, proposer, value } = proposal;

    return (
      <div className={['treasury--Proposal-info', !isApproved && 'with-children'].join(' ')}>
        <Labelled label={t('proposed by')}>
          <InputAddress
            isDisabled
            value={proposer}
            withLabel={false}
          />
        </Labelled>
        <Labelled label={t('beneficiary')}>
          <InputAddress
            isDisabled
            value={beneficiary}
            withLabel={false}
          />
        </Labelled>
        <Static label={t('value')}>
          {formatBalance(value)}
        </Static>
        <Static label={t('bond')}>
          {formatBalance(bond)}
        </Static>
      </div>
    );
  }

  private showApprove = (isApproving: boolean) => (): void => {
    this.setState({
      isApproveOpen: true,
      isApproving
    });
  }

  private hideApprove = (): void => {
    this.setState({
      isApproveOpen: false,
      isApproving: null
    });
  }
}

export default withMulti(
  ProposalDisplay,
  translate,
  withCalls<Props>(
    ['query.treasury.proposals', {
      paramName: 'proposalId',
      propName: 'proposal',
      transform: (value: Option<TreasuryProposal>) =>
        value.unwrapOr(null)
    }]
  ),
  withObservable(keyring.accounts.subject, { propName: 'allAccounts' })
);
