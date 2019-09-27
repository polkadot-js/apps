/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PrefabWasmModule } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';

import React from 'react';
import { Option } from '@polkadot/types';
import { withCalls } from '@polkadot/react-api';
import { InfoForInput } from '@polkadot/react-components';
import { isHex } from '@polkadot/util';

import translate from '../translate';

interface Props extends ApiProps, I18nProps {
  codeHash?: string | null;
  contracts_codeStorage?: Option<PrefabWasmModule>;
  onChange: (isValid: boolean) => void;
}

interface State {
  isStored: boolean;
  isValidHex: boolean;
  isValid: boolean;
}

class ValidateCode extends React.PureComponent<Props, State> {
  public state: State = {
    isStored: false,
    isValidHex: false,
    isValid: false
  };

  public static getDerivedStateFromProps ({ codeHash, contracts_codeStorage, onChange }: Props): State {
    const isValidHex = !!codeHash && isHex(codeHash) && codeHash.length === 66;
    const isStored = !!contracts_codeStorage && contracts_codeStorage.isSome;
    const isValid = isValidHex && isStored;

    // FIXME Really not convinced this is the correct place to do this type of callback?
    onChange(isValid);

    return {
      isStored,
      isValidHex,
      isValid
    };
  }

  public render (): React.ReactNode {
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
    ['query.contracts.codeStorage', { fallbacks: ['query.contract.codeStorage'], paramName: 'codeHash' }]
  )(ValidateCode)
);
