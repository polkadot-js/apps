// Copyright 2017-2018 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { QueueProps } from '@polkadot/ui-signer/types';

import BN from 'bn.js';
import React from 'react';
import InputAddress from '@polkadot/ui-app/InputAddress';
import { QueueConsumer } from '@polkadot/ui-signer/Context';

import VotingButtons from './VotingButtons';
import translate from './translate';

type Props = I18nProps & {
  referendumId: BN
};

type State = {
  publicKey?: Uint8Array
};

class Voting extends React.PureComponent<Props, State> {
  state: State = {};

  render () {
    const { t } = this.props;

    return (
      <div className='democracy--Referendum-vote'>
        <InputAddress
          label={t('voting.account', {
            defaultValue: 'vote using my account'
          })}
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
    const { publicKey } = this.state;

    if (!publicKey) {
      return null;
    }

    return (
      <QueueConsumer>
        {({ queueExtrinsic }: QueueProps) => (
          <VotingButtons
            publicKey={publicKey}
            queueExtrinsic={queueExtrinsic}
            referendumId={referendumId}
          />
        )}
      </QueueConsumer>
    );
  }

  private onChangeAccount = (publicKey?: Uint8Array) => {
    this.setState({ publicKey });
  }
}

export default translate(Voting);
