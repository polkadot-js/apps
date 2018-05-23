// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringOption$Type } from '@polkadot/ui-keyring/types';
import type { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';

import InputAddress from '@polkadot/ui-app/InputAddress';
import Labelled from '@polkadot/ui-app/Labelled';
import classes from '@polkadot/ui-app/util/classes';
import Nonce from '@polkadot/ui-react-rx/Nonce';

import translate from './translate';

type Props = I18nProps & {
  defaultValue?: Uint8Array,
  isError?: boolean,
  isInput?: boolean,
  label: string,
  onChange: (publicKey: Uint8Array, nonce: BN) => void,
  type?: KeyringOption$Type,
  withLabel?: boolean
};

type State = {
  nonce: BN,
  publicKey?: Uint8Array
};

class Account extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      publicKey: props.defaultValue,
      nonce: new BN(0)
    };
  }

  render (): React$Node {
    const { className, defaultValue, isError, isInput, label, style, t, type, withLabel } = this.props;
    const { publicKey } = this.state;

    return (
      <div
        className={classes('extrinsics--Account', 'ui--row', className)}
        style={style}
      >
        <div className='large'>
          <InputAddress
            defaultValue={defaultValue}
            isError={isError}
            isInput={isInput}
            label={label}
            onChange={this.onChangeAccount}
            placeholder='0x...'
            type={type}
            withLabel={withLabel}
          />
        </div>
        <Labelled
          className='small'
          label={t('account.nonce', {
            defaultValue: 'with an next nonce of'
          })}
          withLabel={withLabel}
        >
          <Nonce
            className='ui disabled dropdown selection'
            onChange={this.onChangeNonce}
            params={publicKey}
          />
        </Labelled>
      </div>
    );
  }

  onChangeAccount = (publicKey: Uint8Array): void => {
    const { onChange } = this.props;

    this.setState({ publicKey }, () =>
      onChange(publicKey, this.state.nonce)
    );
  };

  onChangeNonce = (nonce: BN): void => {
    const { onChange } = this.props;

    this.setState({ nonce }, () =>
      onChange(this.state.publicKey, nonce)
    );
  };
}

export default translate(Account);
