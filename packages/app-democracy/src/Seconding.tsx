// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { QueueProps } from '@polkadot/ui-app/Status/types';

import BN from 'bn.js';
import React from 'react';
import { AccountId, Vector } from '@polkadot/types';
import { InputAddress } from '@polkadot/ui-app';
import { QueueConsumer } from '@polkadot/ui-app/Status/Context';

import SecondingButtons from './SecondingButtons';
import translate from './translate';

type Props = I18nProps & {
  addressesWithoutDepositOnProposal: Vector<AccountId>,
  propIndex: BN
};

type State = {
  accountId?: string
};

class Seconding extends React.PureComponent<Props, State> {
  state: State = {};

  render () {
    const { addressesWithoutDepositOnProposal, t } = this.props;

    console.log('addressesWithoutDepositOnProposal', addressesWithoutDepositOnProposal);
    // FIXME - currently it is still allowing any address to second a proposal.
    // but instead we only want `InputAddress` to list of addresses that haven't yet
    // placed a deposit on the proposal (i.e. `addressesWithoutDepositOnProposal`),
    // but how do we do that??

    return (
      <div className='democracy--Proposal-second'>
        <InputAddress
          label={t('second using my account')}
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
    const { propIndex } = this.props;
    const { accountId } = this.state;

    if (!accountId) {
      return null;
    }

    return (
      <QueueConsumer>
        {({ queueExtrinsic }: QueueProps) => (
          <SecondingButtons
            accountId={accountId}
            queueExtrinsic={queueExtrinsic}
            propIndex={propIndex}
          />
        )}
      </QueueConsumer>
    );
  }

  private onChangeAccount = (accountId?: string) => {
    this.setState({ accountId });
  }
}

export default translate(Seconding);
