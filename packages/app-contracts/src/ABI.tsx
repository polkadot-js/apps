// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { InputFile } from '@polkadot/ui-app';
import { ContractAbi } from '@polkadot/types';
import { u8aToString } from '@polkadot/util';

import translate from './translate';

type Props = I18nProps & {
  help: React.ReactNode,
  label: React.ReactNode,
  onChange: (json: string | null, contractAbi: ContractAbi | null) => void
};

type State = {
  abi?: Uint8Array | null,
  isAbiValid: boolean,
  placeholder?: React.ReactNode | null
};

class ABI extends React.PureComponent<Props, State> {
  state: State = {
    isAbiValid: true
  };

  render () {
    const { help, label } = this.props;
    const { isAbiValid, placeholder } = this.state;

    return (
      <InputFile
        help={help}
        isError={!isAbiValid}
        label={label}
        onChange={this.onChange}
        placeholder={placeholder}
      />
    );
  }

  private onChange = (u8a: Uint8Array): void => {
    const { onChange, t } = this.props;

    const json = u8aToString(u8a);

    try {
      const abi = new ContractAbi(JSON.parse(json));

      this.setState({
        isAbiValid: true,
        placeholder: t(`Found the following messages: ${Object.keys(abi.messages).join(', ')}`)
      }, () => onChange(json, abi));
    } catch (error) {
      this.setState({
        isAbiValid: false,
        placeholder: error.message
      }, () => onChange(null, null));
    }
  }
}

export default translate(ABI);
