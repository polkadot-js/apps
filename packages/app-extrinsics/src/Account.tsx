// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringOption$Type } from '@polkadot/ui-keyring/options/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { InputAddress, Labelled } from '@polkadot/ui-app/index';
import { Balance } from '@polkadot/ui-reactive/index';

import translate from './translate';

type Props = I18nProps & {
  defaultValue?: string,
  isDisabled?: boolean,
  isError?: boolean,
  isInput?: boolean,
  label: string,
  onChange?: (accountId: string) => void,
  type?: KeyringOption$Type,
  withLabel?: boolean
};

type State = {
  accountId?: string
};

class Account extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      accountId: props.defaultValue
    };
  }

  render () {
    const { defaultValue, isDisabled, isError, isInput, label, type, withLabel } = this.props;

    return (
      <div className='extrinsics--Account ui--row'>
        <div className='large'>
          <InputAddress
            defaultValue={defaultValue}
            isDisabled={isDisabled}
            isError={isError}
            isInput={isInput}
            label={label}
            onChange={this.onChange}
            placeholder='0x...'
            type={type}
            withLabel={withLabel}
          />
        </div>
        {this.renderBalance()}
      </div>
    );
  }

  private renderBalance (): React.ReactNode {
    const { t, withLabel } = this.props;
    const { accountId } = this.state;

    if (!accountId) {
      return null;
    }

    return (
      <Labelled
        className='small'
        label={t('with an available balance of')}
        withLabel={withLabel}
      >
        <Balance
          className='ui disabled dropdown selection'
          params={accountId}
        />
      </Labelled>
    );
  }

  private onChange = (accountId: string): void => {
    const { onChange } = this.props;

    if (accountId) {
      this.setState({ accountId }, () => {
        onChange && onChange(accountId);
      });
    }
  }
}

export default translate(Account);
