// Copyright 2017-2018 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';
import { I18nProps } from '@polkadot/ui-app/types';
import { EncodedMessage, QueueTx$MessageAdd } from '@polkadot/ui-signer/types';

import React from 'react';

import extrinsics from '@polkadot/extrinsics';
import rpc from '@polkadot/jsonrpc';
import Button from '@polkadot/ui-app/Button';

import Account from './Account';
import Extrinsic from './Extrinsic';
import Nonce from './Nonce';
import translate from './translate';

type Props = I18nProps & {
  queueAdd: QueueTx$MessageAdd
};

type State = {
  isValid: boolean,
  encoded: EncodedMessage,
  nonce: BN,
  ss58: string
};

const defaultExtrinsic = extrinsics.staking.public.transfer;
const defaultRpc = rpc.author.public.submitExtrinsic;

class Selection extends React.PureComponent<Props, State> {
  state: State = {
    isValid: false
  } as State;

  render () {
    const { t } = this.props;
    const { ss58, isValid } = this.state;

    return (
      <div className='extrinsics--Selection'>
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
          rxChange={this.onChangeNonce}
          value={ss58}
        />
        <Button.Group>
          <Button
            isDisabled={!isValid}
            isPrimary
            onClick={this.onQueue}
            text={t('submit.label', {
              defaultValue: 'Submit Transaction'
            })}
          />
        </Button.Group>
      </div>
    );
  }

  nextState (newState: State): void {
    this.setState(
      (prevState: State): State => {
        const { encoded = prevState.encoded, nonce = prevState.nonce, ss58 = prevState.ss58 } = newState;
        const isValid = !!(
          ss58 &&
          ss58.length &&
          encoded &&
          encoded.isValid
        );

        return {
          encoded,
          isValid,
          nonce,
          ss58
        };
      }
    );
  }

  onChangeMessage = (encoded: EncodedMessage): void => {
    this.nextState({ encoded } as State);
  }

  onChangeNonce = (nonce: BN = new BN(0)): void => {
    this.nextState({ nonce } as State);
  }

  onChangeSender = (ss58: string): void => {
    this.nextState({ ss58, nonce: new BN(0) } as State);
  }

  onQueue = (): void => {
    const { queueAdd } = this.props;
    const { encoded: { isValid, values }, nonce, ss58 } = this.state;

    queueAdd({
      isValid,
      nonce,
      ss58,
      rpc: defaultRpc,
      values
    });
  }
}

export default translate(Selection);
