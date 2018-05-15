// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type BN from 'bn.js';
import type { I18nProps } from '@polkadot/ui-app/types';
import type { EncodedMessage, QueueTx } from './types';

import React from 'react';

import extrinsics from '@polkadot/extrinsics-substrate';
import Button from '@polkadot/ui-app/src/Button';
import classes from '@polkadot/ui-app/src/util/classes';

import Account from './Account';
import Extrinsic from './Extrinsic';
import Nonce from './Nonce';
import translate from './translate';

type Props = I18nProps & {
  onQueue: (value: QueueTx) => void
};

type State = {
  isValid: boolean,
  encoded: EncodedMessage,
  nonce: BN,
  publicKey: Uint8Array
};

const defaultExtrinsic = extrinsics.staking.methods.public.transfer;

let id = 0;

class Selection extends React.PureComponent<Props, State> {
  state: State = ({
    isValid: false
  }: $Shape<State>);

  render () {
    const { className, style, t } = this.props;
    const { publicKey, isValid } = this.state;

    return (
      <div
        className={classes('extrinsics--Selection', className)}
        style={style}
      >
        <Account
          isInput={false}
          label={t('display.sender', {
            defaultValue: 'using the selected account'
          })}
          onChange={this.onChangeSender}
          type='account'
        />
        <Extrinsic
          defaultValue={defaultExtrinsic}
          labelMethod={t('display.method', {
            defaultValue: 'submit the following extrinsic'
          })}
          onChange={this.onChangeMessage}
        />
        <Nonce
          label={t('display.nonce', {
            defaultValue: 'with an index'
          })}
          onChange={this.onChangeNonce}
          value={publicKey}
        />
        <Button.Group>
          <Button
            isDisabled={!isValid}
            isPrimary
            onClick={this.onQueue}
            text={t('submit.label', {
              defaultValue: 'Submit Extrinsic'
            })}
          />
        </Button.Group>
      </div>
    );
  }

  nextState (newState: $Shape<State>): void {
    this.setState(
      (prevState: State): State => {
        const { encoded = prevState.encoded, nonce = prevState.nonce, publicKey = prevState.publicKey } = newState;
        const isValid = !!(
          publicKey &&
          publicKey.length &&
          encoded &&
          encoded.isValid
        );

        return {
          encoded,
          isValid,
          nonce,
          publicKey
        };
      }
    );
  }

  onChangeMessage = (encoded: EncodedMessage): void => {
    this.nextState({ encoded });
  }

  onChangeNonce = (nonce: BN): void => {
    this.nextState({ nonce });
  }

  onChangeSender = (publicKey: Uint8Array): void => {
    this.nextState({ publicKey });
  }

  onQueue = (): void => {
    const { onQueue } = this.props;
    const { encoded: { extrinsic, isValid, value }, nonce, publicKey } = this.state;

    onQueue({
      extrinsic,
      id: ++id,
      isValid,
      nonce,
      publicKey,
      status: 'queued',
      value
    });
  }
}

export default translate(Selection);
