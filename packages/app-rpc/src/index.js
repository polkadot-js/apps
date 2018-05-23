// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { InterfaceMethodDefinition } from '@polkadot/storage/types';
import type { RawParam } from '@polkadot/ui-app/Param/types';
import type { I18nProps } from '@polkadot/ui-app/types';

import './index.css';

import BN from 'bn.js';
import React from 'react';

import rpc from '@polkadot/jsonrpc';
import Button from '@polkadot/ui-app/Button';
import InputRpc from '@polkadot/ui-app/InputRpc';
import Params from '@polkadot/ui-app/Params';
import classes from '@polkadot/ui-app/util/classes';

import Account from './Account';
import translate from './translate';

type Props = I18nProps & {};

type State = {
  isValid: boolean,
  method: InterfaceMethodDefinition,
  nonce: BN,
  publicKey: Uint8array | null,
  values: Array<RawParam>
}

const defaultMethod = rpc.author.methods.submitExtrinsic;

class RpcApp extends React.PureComponent<Props, State> {
  state: State = {
    isValid: false,
    method: defaultMethod,
    nonce: new BN(0),
    publicKey: null,
    values: []
  };

  render (): React$Node {
    const { className, style, t } = this.props;
    const { isValid, method } = this.state;

    return (
      <div
        className={classes('rpc--App', className)}
        style={style}
      >
        <InputRpc
          defaultValue={defaultMethod}
          onChange={this.onChangeMethod}
        />
        {this.renderAccount()}
        <Params
          item={method}
          onChange={this.onChangeValues}
        />
        <Button.Group>
          <Button
            isPrimary
            isDisabled={!isValid}
            text={t('submit', {
              defaultValue: 'Submit RPC call'
            })}
          />
        </Button.Group>
      </div>
    );
  }

  renderAccount (): React$Node {
    const { method: { isSigned = false }, publicKey } = this.state;

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
        const { method = prevState.method, nonce = prevState.nonce, publicKey = prevState.publicKey, values = prevState.values } = newState;
        const isValid = values.reduce((isValid, value) => {
          return isValid && value.isValid === true;
        }, !method.isSigned || (!!publicKey && publicKey.length === 32));

        return {
          isValid,
          method,
          nonce,
          publicKey,
          values
        };
      }
    );
  }

  onChangeAccount = (publicKey: Uint8Array, nonce: BN): void => {
    this.nextState({ nonce, publicKey });
  }

  onChangeMethod = (method: InterfaceMethodDefinition): void => {
    this.nextState({ method });
  }

  onChangeValues = (values: Array<RawParam>): void => {
    this.nextState({ values });
  }
}

export default translate(RpcApp);
