// Copyright 2017-2018 @polkadot/app-rpc authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';

import InputAddress from '@polkadot/ui-app/InputAddress';
import Labelled from '@polkadot/ui-app/Labelled';
import Nonce from '@polkadot/ui-react-rx/Nonce';

import translate from './translate';

type Props = I18nProps & {
  defaultValue?: string | null,
  isError?: boolean,
  onChange: (ss58: string | undefined | null, nonce: BN) => void
};

type State = {
  nonce: BN,
  ss58?: string | null
};

class Account extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      ss58: props.defaultValue,
      nonce: new BN(0)
    };
  }

  render () {
    const { defaultValue, isError, t } = this.props;

    return (
      <div className='rpc--Account ui--row'>
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
    const { ss58 } = this.state;

    if (!ss58) {
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
          params={ss58}
        />
      </Labelled>
    );
  }

  onChangeAccount = (ss58: string): void => {
    const { onChange } = this.props;

    if (ss58) {
      this.setState({ ss58 }, () =>
        onChange(ss58, this.state.nonce)
      );
    }
  }

  onChangeNonce = (_nonce: BN): void => {
    const { onChange } = this.props;
    const nonce = _nonce || new BN(0);

    this.setState({ nonce }, () =>
      onChange(this.state.ss58, nonce)
    );
  }
}

export default translate(Account);
