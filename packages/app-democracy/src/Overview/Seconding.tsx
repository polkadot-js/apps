// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import BN from 'bn.js';
import React from 'react';
import { AccountId } from '@polkadot/types';
import { Button, InputAddress, Modal, TxButton } from '@polkadot/ui-app';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { withMulti, withObservable } from '@polkadot/ui-api';

import translate from '../translate';

type Props = I18nProps & {
  allAccounts?: SubjectInfo,
  depositors: Array<AccountId>,
  proposalId: BN | number
};

type State = {
  accountId?: string,
  isSecondingOpen: boolean
};

class Seconding extends React.PureComponent<Props, State> {
  state: State = {
    isSecondingOpen: false
  };

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
            label={t('Second proposal')}
            onClick={this.toggleSeconding}
          />
        </div>
      </>
    );
  }

  private renderModal () {
    const { depositors, proposalId, t } = this.props;
    const { accountId, isSecondingOpen } = this.state;

    if (!isSecondingOpen) {
      return null;
    }

    const isDepositor = !!depositors.find((depositor) => depositor.eq(accountId));

    return (
      <Modal
        dimmer='inverted'
        open
        size='small'
      >
        <Modal.Header>{t('Second proposal')}</Modal.Header>
        <Modal.Content>
          <InputAddress
            help={t('Select the account you wish to second with. This will lock your funds until the proposal is either approved or rejected')}
            label={t('second with account')}
            onChange={this.onChangeAccount}
            type='account'
            withLabel
          />
        </Modal.Content>
        <Modal.Actions>
          <Button.Group>
            <Button
              isNegative
              onClick={this.toggleSeconding}
              label={t('Cancel')}
            />
            <Button.Or />
            <TxButton
              accountId={accountId}
              isDisabled={!accountId || isDepositor}
              isPrimary
              label={t('Second')}
              onClick={this.toggleSeconding}
              params={[proposalId]}
              tx='democracy.second'
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }

  private onChangeAccount = (accountId?: string) => {
    this.setState({ accountId });
  }

  private toggleSeconding = (): void => {
    this.setState(({ isSecondingOpen }) => ({
      isSecondingOpen: !isSecondingOpen
    }));
  }
}

export default withMulti(
  Seconding,
  translate,
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
