// Copyright 2017-2018 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { QueueTx$ExtrinsicAdd } from '@polkadot/ui-app/Status/types';

import BN from 'bn.js';
import React from 'react';
import Api from '@polkadot/api-observable';
import { Extrinsic } from '@polkadot/types';
import { Button } from '@polkadot/ui-app/index';
import { withMulti, withObservable } from '@polkadot/ui-react-rx/with/index';

import translate from './translate';

type Props = I18nProps & {
  accountId?: string,
  queueExtrinsic: QueueTx$ExtrinsicAdd,
  referendumId: BN,
  accountNonce?: BN
};

class VotingButton extends React.PureComponent<Props> {
  render () {
    const { accountId, t } = this.props;

    return (
      <Button.Group>
        <Button
          isDisabled={!accountId}
          isNegative
          text={t('votebtn.nay', {
            defaultValue: 'Nay'
          })}
          onClick={this.onClickNo}
        />
        <Button.Or />
        <Button
          isDisabled={!accountId}
          isPositive
          text={t('votebtn.aye', {
            defaultValue: 'Aye'
          })}
          onClick={this.onClickYes}
        />
      </Button.Group>
    );
  }

  private doVote (vote: boolean) {
    const { accountId, queueExtrinsic, referendumId, accountNonce = new BN(0) } = this.props;

    if (!accountId) {
      return;
    }

    queueExtrinsic({
      extrinsic: new Extrinsic({
        method: Api.extrinsics.democracy.vote(referendumId, vote)
      }),
      accountNonce,
      accountId
    });
  }

  private onClickYes = () => {
    this.doVote(true);
  }

  private onClickNo = () => {
    this.doVote(false);
  }
}

export default withMulti(
  VotingButton,
  translate,
  withObservable('accountNonce', { paramProp: 'accountId' })
);
