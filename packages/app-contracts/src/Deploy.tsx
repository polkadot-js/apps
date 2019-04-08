// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ComponentProps } from './types';

import React from 'react';
import { InputFile } from '@polkadot/ui-app';

import translate from './translate';

type Props = ComponentProps & I18nProps;

type State = {
  abi?: Uint8Array,
  isAbiValid: boolean,
  isWasmValid: boolean,
  wasm?: Uint8Array
};

class Deploy extends React.PureComponent<Props, State> {
  state: State = {
    isAbiValid: true,
    isWasmValid: false
  };

  render () {
    const { t } = this.props;
    const { isAbiValid, isWasmValid } = this.state;

    return (
      <div className='contracts--Deploy'>
        <InputFile
          help={t('The compiled WASM for the contract that you wish to deploy. Ecah unique code blob will be attached with a code hash that can be used to create new instances.')}
          isError={!isWasmValid}
          label={t('Compiled contract WASM')}
          onChange={this.onAddWasm}
        />
        <InputFile
          help={t('The ABI for the WASM code. In this step it is optional, but required once you wish to create contracts or call into deployed contracts.')}
          isError={!isAbiValid}
          label={t('Contract ABI (optional)')}
          onChange={this.onAddAbi}
        />
      </div>
    );
  }

  private onAddAbi = (abi: Uint8Array): void => {
    this.setState({ abi });
  }

  private onAddWasm = (wasm: Uint8Array): void => {
    this.setState({ wasm, isWasmValid: true });
  }
}

export default translate(Deploy);
