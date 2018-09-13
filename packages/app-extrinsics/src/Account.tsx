// Copyright 2017-2018 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringOption$Type } from '@polkadot/ui-keyring/options/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import InputAddress from '@polkadot/ui-app/InputAddress';
import Labelled from '@polkadot/ui-app/Labelled';
import Balance from '@polkadot/ui-react-rx/Balance';

import translate from './translate';

type Props = I18nProps & {
  defaultValue?: Uint8Array,
  isDisabled?: boolean,
  isError?: boolean,
  isInput?: boolean,
  label: string,
  onChange?: (publicKey: Uint8Array) => void,
  type?: KeyringOption$Type,
  withLabel?: boolean
};

type State = {
  publicKey?: Uint8Array
};

class Account extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      publicKey: props.defaultValue
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
    const { publicKey } = this.state;

    if (!publicKey) {
      return null;
    }

    return (
      <Labelled
        className='small'
        label={t('account.balance', {
          defaultValue: 'with an available balance of'
        })}
        withLabel={withLabel}
      >
        <Balance
          className='ui disabled dropdown selection'
          params={publicKey}
        />
      </Labelled>
    );
  }

  private onChange = (publicKey: Uint8Array): void => {
    const { onChange } = this.props;

    this.setState({ publicKey }, () =>
      onChange && onChange(publicKey)
    );
  }
}

export default translate(Account);
