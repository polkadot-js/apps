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
  ss58?: string
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
    const { ss58 } = this.state;

    if (!ss58) {
      return null;
    }

    return (
      <QueueConsumer>
        {({ queueExtrinsic }: QueueProps) => (
          <VotingButtons
            ss58={ss58}
            queueExtrinsic={queueExtrinsic}
            referendumId={referendumId}
          />
        )}
      </QueueConsumer>
    );
  }

  private onChangeAccount = (ss58?: string) => {
    this.setState({ ss58 });
  }
}

export default translate(Voting);
