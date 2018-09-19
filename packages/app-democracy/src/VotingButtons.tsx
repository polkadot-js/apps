// Copyright 2017-2018 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { QueueTx$ExtrinsicAdd } from '@polkadot/ui-signer/types';

import BN from 'bn.js';
import React from 'react';
import extrinsics from '@polkadot/extrinsics';
import Button from '@polkadot/ui-app/Button';
import withMulti from '@polkadot/ui-react-rx/with/multi';
import withObservable from '@polkadot/ui-react-rx/with/observable';

import translate from './translate';

type Props = I18nProps & {
  publicKey?: Uint8Array,
  queueExtrinsic: QueueTx$ExtrinsicAdd,
  referendumId: BN,
  systemAccountIndexOf?: BN
};

class VotingButton extends React.PureComponent<Props> {
  render () {
    const { publicKey, t } = this.props;

    return (
      <Button.Group>
        <Button
          isDisabled={!publicKey}
          isNegative
          text={t('votebtn.nay', {
            defaultValue: 'Nay'
          })}
          onClick={this.onClickNo}
        />
        <Button.Or />
        <Button
          isDisabled={!publicKey}
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
    const { publicKey, queueExtrinsic, referendumId, systemAccountIndexOf = new BN(0) } = this.props;

    if (!publicKey) {
      return;
    }

    queueExtrinsic({
      extrinsic: extrinsics.democracy.public.vote,
      nonce: systemAccountIndexOf,
      publicKey,
      values: [referendumId, vote]
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
  translate(VotingButton),
  withObservable('systemAccountIndexOf', { paramProp: 'publicKey' })
);
