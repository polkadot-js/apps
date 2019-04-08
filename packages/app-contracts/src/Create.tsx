// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ComponentProps } from './types';

import React from 'react';
import { Button, Dropdown } from '@polkadot/ui-app';
import { ContractAbi } from '@polkadot/types';

import ABI from './ABI';
import translate from './translate';

type Props = ComponentProps & I18nProps;

type State = {
  abi?: string | null,
  contractAbi?: ContractAbi | null,
  isAbiValid: boolean,
  isHashValid: boolean
};

class Create extends React.PureComponent<Props, State> {
  state: State = {
    isAbiValid: false,
    isHashValid: false
  };

  render () {
    const { t } = this.props;
    const { isAbiValid, isHashValid } = this.state;
    const isValid = isAbiValid && isHashValid;

    return (
      <div className='contracts--Create'>
        <Dropdown
          help={t('The contract WASM previous deployed. Internally this is identified by the hash of the code, as either created or attached.')}
          isError={!isHashValid}
          label={t('Code for deployment')}
          options={[]}
        />
        <ABI
          help={t('The ABI for the WASM code. Since we will be making a call into the code, the ABI is required and strored for future operations such as calls.')}
          label={t('Contract ABI')}
          onChange={this.onAddAbi}
        />
        <Button.Group>
          <Button
            isDisabled={!isValid}
            isPrimary
            onClick={this.onCreate}
            label={t('Create')}
          />
        </Button.Group>
      </div>
    );
  }

  private onAddAbi = (abi: string | null, contractAbi: ContractAbi | null): void => {
    this.setState({ abi, contractAbi, isAbiValid: !!abi });
  }

  private onCreate = (): void => {
    // do stuff
  }
}

export default translate(Create);
