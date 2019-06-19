// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';

import React from 'react';
import { ContractInfo, Option } from '@polkadot/types';
import { withCalls } from '@polkadot/ui-api';
import { InfoForInput } from '@polkadot/ui-app';
import keyring from '@polkadot/ui-keyring';

import translate from '../translate';

type Props = ApiProps & I18nProps & {
  address?: string | null,
  contract_contractInfoOf?: Option<ContractInfo>,
  onChange: (isValid: boolean) => void
};

type State = {
  isStored: boolean,
  isValidAddr: boolean,
  isValid: boolean
};

class ValidateAddr extends React.PureComponent<Props> {
  state: State = {
    isStored: false,
    isValidAddr: false,
    isValid: false
  };

  static getDerivedStateFromProps ({ address, contract_contractInfoOf, onChange }: Props): State {
    let isValidAddr = false;

    try {
      keyring.decodeAddress(address || '');

      isValidAddr = true;
    } catch (error) {
      // ignore
    }

    const isStored = (
      (!!contract_contractInfoOf && contract_contractInfoOf.isSome)
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

  render () {
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
    ['query.contracts.contractInfoOf', { paramName: 'address' }], // 2.x
    ['query.contract.contractInfoOf', { paramName: 'address' }] // 1.x
  )(ValidateAddr)
);
