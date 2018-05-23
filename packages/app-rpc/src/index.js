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
import InputRpc from '@polkadot/ui-app/InputRpc';
import Params from '@polkadot/ui-app/Params';
import classes from '@polkadot/ui-app/util/classes';

import Account from './Account';
import translate from './translate';

type Props = I18nProps & {};

type State = {
  method: InterfaceMethodDefinition,
  nonce: BN,
  publicKey: Uint8array | null,
  values: Array<RawParam>
}

const defaultMethod = rpc.author.methods.submitExtrinsic;

console.log('defaultMethod', defaultMethod);

class RpcApp extends React.PureComponent<Props, State> {
  state: State = {
    method: defaultMethod,
    nonce: new BN(0),
    publicKey: null,
    values: []
  };

  render (): React$Node {
    const { className, style } = this.props;
    const { method } = this.state;

    return (
      <div
        className={classes('rpc--App', className)}
        style={style}
      >
        <InputRpc
          defaultValue={defaultMethod}
          onChange={this.onChangeMethod}
        />
        <Params
          item={method}
          onChange={this.onChangeValues}
        />
        {this.renderAccount()}
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

  onChangeAccount = (publicKey: Uint8Array, nonce: BN): void => {
    this.setState({ nonce, publicKey });
  }

  onChangeMethod = (method: InterfaceMethodDefinition): void => {
    this.setState({ method });
  }

  onChangeValues = (values: Array<RawParam>): void => {
    this.setState({ values });
  }
}

export default translate(RpcApp);
