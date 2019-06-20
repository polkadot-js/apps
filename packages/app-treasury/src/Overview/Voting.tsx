// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import BN from 'bn.js';
import React from 'react';
import { Button, InputAddress, TxButton } from '@polkadot/ui-app';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { withMulti, withObservable } from '@polkadot/ui-api';

import translate from '../translate';

type Props = I18nProps & {
  allAccounts?: SubjectInfo,
  referendumId: BN | number
};

type State = {
  accountId?: string
};

const VOTE_NAY = 0;
const VOTE_YAY = -1; // Yes, this is weird, but voting works on i8 with the high bit set

class Voting extends React.PureComponent<Props, State> {
  state: State = {};

  render () {
    const { allAccounts, referendumId, t } = this.props;
    const { accountId } = this.state;
    const hasAccounts = allAccounts && Object.keys(allAccounts).length !== 0;

    if (!hasAccounts) {
      return null;
    }

    return (
      <div className='democracy--Referendum-vote'>
        <InputAddress
          help={t('Select the account you wish to vote with. You can approve "yay" or deny "nay" the proposal.')}
          label={t('using my account')}
          onChange={this.onChangeAccount}
          type='account'
          withLabel
        />
        <Button.Group>
          <TxButton
            accountId={accountId}
            isDisabled={!accountId}
            isNegative
            label={t('Nay')}
            params={[referendumId, VOTE_NAY]}
            tx='democracy.vote'
          />
          <Button.Or />
          <TxButton
            accountId={accountId}
            isDisabled={!accountId}
            isPositive
            label={t('Aye')}
            params={[referendumId, VOTE_YAY]}
            tx='democracy.vote'
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
  Voting,
  translate,
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
