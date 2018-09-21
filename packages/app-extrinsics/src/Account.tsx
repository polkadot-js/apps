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
  defaultValue?: string,
  isDisabled?: boolean,
  isError?: boolean,
  isInput?: boolean,
  label: string,
  onChange?: (ss58: string) => void,
  type?: KeyringOption$Type,
  withLabel?: boolean
};

type State = {
  ss58?: string
};

class Account extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      ss58: props.defaultValue
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
    const { ss58 } = this.state;

    if (!ss58) {
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
          params={ss58}
        />
      </Labelled>
    );
  }

  private onChange = (ss58: string): void => {
    const { onChange } = this.props;

    if (ss58) {
      this.setState({ ss58 }, () => {
        onChange && onChange(ss58);
      });
    }
  }
}

export default translate(Account);
