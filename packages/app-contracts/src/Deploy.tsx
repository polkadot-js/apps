// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ComponentProps } from './types';

import React from 'react';
import { Button, Input, InputFile } from '@polkadot/ui-app';

import ABI from './ABI';
import translate from './translate';

type Props = ComponentProps & I18nProps;

type State = {
  abi?: string | null,
  isAbiValid: boolean,
  isNameValid: boolean,
  isWasmValid: boolean,
  name?: string,
  wasm?: Uint8Array | null
};

class Deploy extends React.PureComponent<Props, State> {
  state: State = {
    isAbiValid: true,
    isNameValid: false,
    isWasmValid: false
  };

  render () {
    const { t } = this.props;
    const { isAbiValid, isNameValid, isWasmValid } = this.state;
    const isValid = isAbiValid && isNameValid && isWasmValid;

    return (
      <div className='contracts--Deploy'>
        <Input
          help={t('A name for this wasm code that helps to user distinguish. Only used for display purposes.')}
          isError={!isNameValid}
          label={t('Code bundle name')}
          onChange={this.onChangeName}
        />
        <InputFile
          help={t('The compiled WASM for the contract that you wish to deploy. Ecah unique code blob will be attached with a code hash that can be used to create new instances.')}
          isError={!isWasmValid}
          label={t('Compiled contract WASM')}
          onChange={this.onAddWasm}
        />
        <ABI
          help={t('The ABI for the WASM code. In this step it is optional, but required once you wish to create contracts or call into deployed contracts.')}
          label={t('Contract ABI (optional)')}
          onChange={this.onAddAbi}
        />
        <Button.Group>
          <Button
            isDisabled={!isValid}
            isPrimary
            onClick={this.onDeploy}
            label={t('Deploy')}
          />
        </Button.Group>
      </div>
    );
  }

  private onAddAbi = (abi: string | null): void => {
    this.setState({ abi, isAbiValid: !!abi });
  }

  private onAddWasm = (wasm: Uint8Array): void => {
    this.setState({ wasm, isWasmValid: true });
  }

  private onChangeName = (name: string): void => {
    this.setState({ name, isNameValid: name.length !== 0 });
  }

  private onDeploy = (): void => {
    // deploy
  }
}

export default translate(Deploy);
