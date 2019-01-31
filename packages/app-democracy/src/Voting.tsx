// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { QueueProps } from '@polkadot/ui-app/Status/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import BN from 'bn.js';
import React from 'react';
import { InputAddress } from '@polkadot/ui-app/index';
import { QueueConsumer } from '@polkadot/ui-app/Status/Context';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { withMulti, withObservable } from '@polkadot/ui-api/index';

import VotingButtons from './VotingButtons';
import translate from './translate';

type Props = I18nProps & {
  allAccounts?: SubjectInfo,
  referendumId: BN | number
};

type State = {
  accountId?: string
};

class Voting extends React.PureComponent<Props, State> {
  state: State = {};

  render () {
    const { allAccounts, t } = this.props;
    const hasAccounts = allAccounts && Object.keys(allAccounts).length !== 0;

    if (!hasAccounts) {
      return null;
    }

    return (
      <div className='democracy--Referendum-vote'>
        <InputAddress
          label={t('vote using my account')}
          onChange={this.onChangeAccount}
          placeholder='0x...'
          type='account'
          withLabel
        />
        {this.renderButtons()}
      </div>
    );
  }

  private renderButtons () {
    const { referendumId } = this.props;
    const { accountId } = this.state;

    if (!accountId) {
      return null;
    }

    return (
      <QueueConsumer>
        {({ queueExtrinsic }: QueueProps) => (
          <VotingButtons
            accountId={accountId}
            queueExtrinsic={queueExtrinsic}
            referendumId={referendumId}
          />
        )}
      </QueueConsumer>
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
