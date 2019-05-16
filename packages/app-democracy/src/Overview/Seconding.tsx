// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import BN from 'bn.js';
import React from 'react';
import { AccountId } from '@polkadot/types';
import { Button, InputAddress, TxButton } from '@polkadot/ui-app';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { withMulti, withObservable } from '@polkadot/ui-api';

import translate from '../translate';

type Props = I18nProps & {
  allAccounts?: SubjectInfo,
  depositors: Array<AccountId>,
  proposalId: BN | number
};

type State = {
  accountId?: string
};

class Seconding extends React.PureComponent<Props, State> {
  state: State = {};

  render () {
    const { allAccounts, depositors, proposalId, t } = this.props;
    const { accountId } = this.state;
    const hasAccounts = allAccounts && Object.keys(allAccounts).length !== 0;

    if (!hasAccounts) {
      return null;
    }

    const isDepositor = !!depositors.find((depositor) => depositor.eq(accountId));

    return (
      <div className='democarcy--Proposal-second'>
        <InputAddress
          help={t('Select the account you wish to second with. This will lock your funds until the proposal is either approved or rejected')}
          label={t('using my account')}
          onChange={this.onChangeAccount}
          type='account'
          withLabel
        />
        <Button.Group>
          <TxButton
            accountId={accountId}
            isDisabled={!accountId || isDepositor}
            isPrimary
            label={t('Second')}
            params={[proposalId]}
            tx='democracy.second'
          />
        </Button.Group>
      </div>
    );
  }

  private onChangeAccount = (accountId?: string) => {
    this.setState({ accountId });
  }
}

export default withMulti(
  Seconding,
  translate,
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
