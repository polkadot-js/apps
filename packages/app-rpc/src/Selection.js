// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Interface$Method } from '@polkadot/jsonrpc/types';
import type { RawParam } from '@polkadot/ui-app/Params/types';
import type { I18nProps } from '@polkadot/ui-app/types';
import type { QueueTx$MessageAdd } from '@polkadot/ui-signer/types';

import './index.css';

import BN from 'bn.js';
import React from 'react';

import rpc from '@polkadot/jsonrpc';
import Button from '@polkadot/ui-app/Button';
import InputRpc from '@polkadot/ui-app/InputRpc';
import Params from '@polkadot/ui-app/Params';
import classes from '@polkadot/ui-app/util/classes';
import rawToValues from '@polkadot/ui-signer/rawToValues';

import Account from './Account';
import translate from './translate';

type Props = I18nProps & {
  queueAdd: QueueTx$MessageAdd
};

type State = {
  isValid: boolean,
  nonce: BN,
  publicKey?: Uint8Array | null,
  rpc: Interface$Method,
  values: Array<RawParam>
}

const defaultMethod = rpc.author.methods.submitExtrinsic;

class Selection extends React.PureComponent<Props, State> {
  state: State = {
    isValid: false,
    nonce: new BN(0),
    publicKey: null,
    rpc: defaultMethod,
    values: []
  };

  render (): React$Node {
    const { className, style, t } = this.props;
    const { isValid, rpc } = this.state;

    return (
      <div
        className={classes('rpc--Selection', className)}
        style={style}
      >
        <InputRpc
          defaultValue={defaultMethod}
          onChange={this.onChangeMethod}
        />
        {this.renderAccount()}
        <Params
          item={rpc}
          onChange={this.onChangeValues}
        />
        <Button.Group>
          <Button
            isDisabled={!isValid}
            isPrimary
            onClick={this.onSubmit}
            text={t('submit', {
              defaultValue: 'Submit RPC call'
            })}
          />
        </Button.Group>
      </div>
    );
  }

  renderAccount (): React$Node {
    const { rpc: { isSigned = false }, publicKey } = this.state;

    if (!isSigned) {
      return null;
    }

    return (
      <Account
        defaultValue={publicKey}
        onChange={this.onChangeAccount}
      />
    );
  }

  nextState (newState: $Shape<State>): void {
    this.setState(
      (prevState: State): State => {
        const { rpc = prevState.rpc, nonce = prevState.nonce, publicKey = prevState.publicKey, values = prevState.values } = newState;
        const isValid = values.reduce((isValid, value) => {
          return isValid && value.isValid === true;
        }, rpc.isSigned !== true || (!!publicKey && publicKey.length === 32));

        return {
          isValid,
          rpc,
          nonce,
          publicKey,
          values
        };
      }
    );
  }

  onChangeAccount = (publicKey?: Uint8Array, nonce: BN): void => {
    this.nextState({ nonce, publicKey });
  }

  onChangeMethod = (rpc: Interface$Method): void => {
    this.nextState({ rpc });
  }

  onChangeValues = (values: Array<RawParam>): void => {
    this.nextState({ values });
  }

  onSubmit = (): void => {
    const { queueAdd } = this.props;
    const { isValid, nonce, publicKey, rpc, values } = this.state;

    queueAdd({
      isValid,
      nonce,
      publicKey,
      rpc,
      values: rawToValues(values)
    });
  }
}

export default translate(Selection);
