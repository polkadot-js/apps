/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractInfo } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';

import React from 'react';
import { Option } from '@polkadot/types';
import { withCalls } from '@polkadot/ui-api';
import { InfoForInput } from '@polkadot/ui-app';
import keyring from '@polkadot/ui-keyring';

import translate from '../translate';

type Props = ApiProps & I18nProps & {
  address?: string | null;
  contracts_contractInfoOf?: Option<ContractInfo>;
  onChange: (isValid: boolean) => void;
};

interface State {
  isStored: boolean;
  isValidAddr: boolean;
  isValid: boolean;
}

class ValidateAddr extends React.PureComponent<Props> {
  public state: State = {
    isStored: false,
    isValidAddr: false,
    isValid: false
  };

  public static getDerivedStateFromProps ({ address, contracts_contractInfoOf, onChange }: Props): State {
    let isValidAddr = false;

    try {
      keyring.decodeAddress(address || '');

      isValidAddr = true;
    } catch (error) {
      // ignore
    }

    const isStored = (
      (!!contracts_contractInfoOf && contracts_contractInfoOf.isSome)
      // (!!contract_codeHashOf && contract_codeHashOf.isSome)
    );
    const isValid = isValidAddr && isStored;

    // FIXME Really not convinced this is the correct place to do this type of callback?
    onChange(isValid);

    return {
      isStored,
      isValidAddr,
      isValid
    };
  }

  public render (): React.ReactNode {
    const { t } = this.props;
    const { isValid, isValidAddr } = this.state;

    if (isValid || !isValidAddr) {
      return null;
    }

    return (
      <InfoForInput type='error'>
        {
          isValidAddr
            ? t('Unable to find deployed contract code at the specified address')
            : t('The value is not in a valid address format')
        }
      </InfoForInput>
    );
  }
}

export default translate(
  withCalls<Props>(
    ['query.contracts.contractInfoOf', { fallbacks: ['query.contract.contractInfoOf'], paramName: 'address' }]
  )(ValidateAddr)
);
