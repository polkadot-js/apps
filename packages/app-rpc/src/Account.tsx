// Copyright 2017-2018 @polkadot/app-rpc authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';

import InputAddress from '@polkadot/ui-app/InputAddress';
import Labelled from '@polkadot/ui-app/Labelled';
import classes from '@polkadot/ui-app/util/classes';
import Nonce from '@polkadot/ui-react-rx/Nonce';

import translate from './translate';

type Props = I18nProps & {
  defaultValue?: Uint8Array | null,
  isError?: boolean,
  onChange: (publicKey: Uint8Array | undefined | null, nonce: BN) => void
};

type State = {
  nonce: BN,
  publicKey?: Uint8Array | null
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

  render () {
    const { className, defaultValue, isError, style, t } = this.props;

    return (
      <div
        className={classes('rpc--Account', 'ui--row', className)}
        style={style}
      >
        <div className='large'>
          <InputAddress
            defaultValue={defaultValue}
            isError={isError}
            label={t('account.address', {
              defaultValue: 'sign data from account'
            })}
            onChange={this.onChangeAccount}
            placeholder='0x...'
            type='account'
          />
        </div>
        {this.renderNonce()}
      </div>
    );
  }

  renderNonce () {
    const { t } = this.props;
    const { publicKey } = this.state;

    if (!publicKey) {
      return null;
    }

    return (
      <Labelled
        className='small'
        label={t('account.nonce', {
          defaultValue: 'with an index of'
        })}
      >
        <Nonce
          className='ui disabled dropdown selection'
          rxChange={this.onChangeNonce}
          params={publicKey}
        />
      </Labelled>
    );
  }

  onChangeAccount = (publicKey: Uint8Array): void => {
    const { onChange } = this.props;

    this.setState({ publicKey }, () =>
      onChange(publicKey, this.state.nonce)
    );
  }

  onChangeNonce = (_nonce: BN): void => {
    const { onChange } = this.props;
    const nonce = _nonce || new BN(0);

    this.setState({ nonce }, () =>
      onChange(this.state.publicKey, nonce)
    );
  }
}

export default translate(Account);
