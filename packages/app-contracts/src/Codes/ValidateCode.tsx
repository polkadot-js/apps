// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';

import React from 'react';
import { Option, PrefabWasmModule } from '@polkadot/types';
import { withCalls } from '@polkadot/ui-api';
import { InfoForInput } from '@polkadot/ui-app';
import { isHex } from '@polkadot/util';

import translate from '../translate';

type Props = ApiProps & I18nProps & {
  codeHash?: string | null,
  contract_codeStorage?: Option<PrefabWasmModule>,
  onChange: (isValid: boolean) => void
};

type State = {
  isStored: boolean,
  isValidHex: boolean,
  isValid: boolean
};

class ValidateCode extends React.PureComponent<Props> {
  state: State = {
    isStored: false,
    isValidHex: false,
    isValid: false
  };

  static getDerivedStateFromProps ({ codeHash, contract_codeStorage, onChange }: Props): State {
    const isValidHex = !!codeHash && isHex(codeHash) && codeHash.length === 66;
    const isStored = !!contract_codeStorage && contract_codeStorage.isSome;
    const isValid = isValidHex && isStored;

    // FIXME Really not convinced this is the correct place to do this type of callback?
    onChange(isValid);

    return {
      isStored,
      isValidHex,
      isValid
    };
  }

  render () {
    const { t } = this.props;
    const { isValid, isValidHex } = this.state;

    if (isValid || !isValidHex) {
      return null;
    }

    return (
      <InfoForInput type='error'>
        {
          isValidHex
            ? t('Unable to find on-chain WASM code for the supplied codeHash')
            : t('The codeHash is not a valid hex hash')
        }
      </InfoForInput>
    );
  }
}

export default translate(
  withCalls<Props>(
    ['query.contracts.codeStorage', { paramName: 'codeHash' }], // 2.x
    ['query.contract.codeStorage', { paramName: 'codeHash' }] // 1.x
  )(ValidateCode)
);
