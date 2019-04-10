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
  isError?: boolean,
  label: React.ReactNode,
  onChange: (json: string | null, contractAbi: ContractAbi | null) => void
};

type State = {
  abi?: Uint8Array | null,
  isAbiValid: boolean,
  name?: string,
  placeholder?: React.ReactNode | null
};

class ABI extends React.PureComponent<Props, State> {
  state: State = {
    isAbiValid: true
  };

  render () {
    const { help, isError, label } = this.props;
    const { isAbiValid, placeholder } = this.state;

    return (
      <InputFile
        help={help}
        isError={!isAbiValid || isError}
        label={label}
        onChange={this.onChange}
        placeholder={placeholder}
      />
    );
  }

  private onChange = (u8a: Uint8Array, name: string): void => {
    const { onChange } = this.props;
    const json = u8aToString(u8a);

    try {
      const abi = new ContractAbi(JSON.parse(json));

      this.setState({
        isAbiValid: true,
        name,
        placeholder: `${name} (${Object.keys(abi.messages).join(', ')})`
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
