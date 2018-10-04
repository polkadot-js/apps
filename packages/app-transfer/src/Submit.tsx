// Copyright 2017-2018 @polkadot/app-transfer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { QueueTx$Extrinsic, QueueTx$ExtrinsicAdd } from '@polkadot/ui-signer/types';

import BN from 'bn.js';
import React from 'react';
import Api from '@polkadot/api-observable';
import { Index } from '@polkadot/types';
import Button from '@polkadot/ui-app/Button';
import withMulti from '@polkadot/ui-react-rx/with/multi';
import withObservable from '@polkadot/ui-react-rx/with/observable';

import translate from './translate';

type Props = I18nProps & {
  isDisabled: boolean,
  accountNonce?: Index,
  amount: BN,
  from: Uint8Array,
  to: Uint8Array,
  queueExtrinsic: QueueTx$ExtrinsicAdd
};

class Submit extends React.PureComponent<Props> {
  render () {
    const { isDisabled, t } = this.props;

    return (
      <Button.Group>
        <Button
          isDisabled={isDisabled}
          isPrimary
          onClick={this.onMakeTransfer}
          text={t('maketransfer', {
            defaultValue: 'Make Transfer'
          })}
        />
      </Button.Group>
    );
  }

  private onMakeTransfer = () => {
    const { accountNonce, amount, from, to, queueExtrinsic } = this.props;

    queueExtrinsic({
      extrinsic: Api.extrinsics.balances.transfer(to, amount),
      accountNonce: accountNonce || new Index(0),
      publicKey: from
    } as QueueTx$Extrinsic);
  }
}

export default withMulti(
  translate(Submit),
  withObservable('accountNonce', { paramProp: 'from' })
);
