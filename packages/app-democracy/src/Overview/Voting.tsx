// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import BN from 'bn.js';
import React from 'react';
import { Button, Dropdown, InputAddress, Modal, TxButton } from '@polkadot/ui-app';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { withMulti, withObservable } from '@polkadot/ui-api';

import translate from '../translate';

type Props = I18nProps & {
  allAccounts?: SubjectInfo,
  referendumId: BN | number
};

type State = {
  accountId?: string,
  isVotingOpen: boolean,
  voteOptions: Array<{ text: React.ReactNode, value: boolean }>,
  voteValue: boolean
};

class Voting extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const { t } = props;

    this.state = {
      isVotingOpen: false,
      voteOptions: [
        { text: t('Yay, I approve'), value: true },
        { text: t('Nay, I do not approve'), value: false }
      ],
      voteValue: true
    };
  }

  render () {
    const { allAccounts, t } = this.props;
    const hasAccounts = allAccounts && Object.keys(allAccounts).length !== 0;

    if (!hasAccounts) {
      return null;
    }

    return (
      <>
        {this.renderModal()}
        <div className='ui--Row-buttons'>
          <Button
            isPrimary
            label={t('Vote')}
            onClick={this.toggleVoting}
          />
        </div>
      </>
    );
  }

  private renderModal () {
    const { referendumId, t } = this.props;
    const { accountId, isVotingOpen, voteOptions, voteValue } = this.state;

    if (!isVotingOpen) {
      return null;
    }

    return (
      <Modal
        dimmer='inverted'
        open
        size='small'
      >
        <Modal.Header>{t('Vote on proposal')}</Modal.Header>
        <Modal.Content>
          <InputAddress
            help={t('Select the account you wish to vote with. You can approve "yay" or deny "nay" the proposal.')}
            label={t('vote with account')}
            onChange={this.onChangeAccount}
            type='account'
            withLabel
          />
          <Dropdown
            help={t('Select your vote preferences for this proposal, either to approve or disapprove')}
            label={t('record my vote as')}
            options={voteOptions}
            onChange={this.onChangeVote}
            value={voteValue}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button.Group>
            <Button
              isNegative
              onClick={this.toggleVoting}
              label={t('Cancel')}
            />
            <Button.Or />
            <TxButton
              accountId={accountId}
              isDisabled={!accountId}
              isPrimary
              label={t('Vote')}
              onClick={this.toggleVoting}
              params={[referendumId, voteValue]}
              tx='democracy.vote'
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }

  private onChangeAccount = (accountId?: string) => {
    this.setState({ accountId });
  }

  private onChangeVote = (voteValue: boolean) => {
    this.setState({ voteValue });
  }

  private toggleVoting = (): void => {
    this.setState(({ isVotingOpen }) => ({
      isVotingOpen: !isVotingOpen
    }));
  }
}

export default withMulti(
  Voting,
  translate,
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
