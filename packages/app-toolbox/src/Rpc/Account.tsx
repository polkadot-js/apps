// Copyright 2017-2019 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { InputAddress, Labelled } from '@polkadot/ui-app';
import { Nonce } from '@polkadot/ui-reactive';

import translate from './translate';

type Props = I18nProps & {
  defaultValue?: string | null,
  isError?: boolean,
  onChange: (accountId: string | undefined | null, accountNonce: BN) => void
};

type State = {
  accountNonce: BN,
  accountId?: string | null
};

class Account extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      accountId: props.defaultValue,
      accountNonce: new BN(0)
    };
  }

  render () {
    const { className, defaultValue, isError, t } = this.props;

    return (
      <div className={`ui--row ${className}`}>
        <div className='large'>
          <InputAddress
            defaultValue={defaultValue}
            isError={isError}
            label={t('sign data from account')}
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
    const { accountId } = this.state;

    if (!accountId) {
      return null;
    }

    return (
      <Labelled
        className='small'
        label={t('with an index of')}
      >
        <Nonce
          className='ui disabled dropdown selection'
          callOnResult={this.onChangeNonce}
          params={accountId}
        />
      </Labelled>
    );
  }

  onChangeAccount = (accountId: string): void => {
    const { onChange } = this.props;

    this.setState({ accountId }, () =>
      onChange(accountId, this.state.accountNonce)
    );
  }

  onChangeNonce = (_accountNonce: BN): void => {
    const { onChange } = this.props;
    const accountNonce = _accountNonce || new BN(0);

    this.setState({ accountNonce }, () =>
      onChange(this.state.accountId, accountNonce)
    );
  }
}

export default translate(styled(Account)`
  box-sizing: border-box;
  padding-left: 2em;
`);
