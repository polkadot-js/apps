// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type BN from 'bn.js';
import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { EncodedMessage, QueueTx } from '../types';

import './Selection.css';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';
import extrinsics from '@polkadot/extrinsics-substrate';

import Account from '../Account';
import Extrinsic from '../Extrinsic';
import translate from '../translate';
import Nonce from './Nonce';

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
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      isValid: false
    };
  }

  render () {
    const { className, style, t } = this.props;
    const { publicKey, isValid } = this.state;

    return (
      <div
        className={['extrinsics--Selection', className].join(' ')}
        style={style}
      >
        <Account
          label={t('display.sender', {
            defaultValue: 'using the selected account'
          })}
          onChange={this.onChangeSender}
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
        <div className='extrinsics--Selection-ButtonRow'>
          <Button
            disabled={!isValid}
            onClick={this.onQueue}
            primary
          >
            {t('submit.label', {
              defaultValue: 'Submit Extrinsic'
            })}
          </Button>
        </div>
      </div>
    );
  }

  validateState = (newState: $Shape<State>): void => {
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

  onChangeMessage = (encoded: EncodedParams): void => {
    this.validateState({ encoded });
  }

  onChangeNonce = (nonce: BN): void => {
    this.validateState({ nonce });
  }

  onChangeSender = (publicKey: Uint8Array): void => {
    this.validateState({ publicKey });
  }

  onQueue = (): void => {
    const { onQueue } = this.props;
    const { encoded: { data, extrinsic, isValid }, nonce, publicKey } = this.state;

    onQueue({
      data,
      extrinsic,
      id: ++id,
      isValid,
      nonce,
      publicKey
    });
  }
}

export default translate(Selection);
