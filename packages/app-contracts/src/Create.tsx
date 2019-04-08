// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ComponentProps } from './types';

import React from 'react';
import { Dropdown, InputFile } from '@polkadot/ui-app';

import translate from './translate';

type Props = ComponentProps & I18nProps;

type State = {
  abi?: Uint8Array,
  isAbiValid: boolean
};

class Create extends React.PureComponent<Props, State> {
  state: State = {
    isAbiValid: false
  };

  render () {
    const { t } = this.props;
    const { isAbiValid } = this.state;

    return (
      <div className='contracts--Create'>
        <Dropdown
          help={t('The contract WASM previous deployed. Internally this is identified by the hash of the code, as either created or attached.')}
          label={t('Code for deployment')}
          options={[]}
        />
        <InputFile
          help={t('The ABI for the WASM code. Since we will be making a call into the code, the ABI is required and strored for future operations such as calls.')}
          isError={!isAbiValid}
          label={t('Contract ABI')}
          onChange={this.onAddAbi}
        />
      </div>
    );
  }

  private onAddAbi = (abi: Uint8Array): void => {
    this.setState({ abi });
  }
}

export default translate(Create);
