/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractInfo } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';

import React, { useEffect, useState } from 'react';
import { Option } from '@polkadot/types';
import { withCalls } from '@polkadot/react-api';
import { InfoForInput } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';

import translate from '../translate';

interface Props extends ApiProps, I18nProps {
  address?: string | null;
  contracts_contractInfoOf?: Option<ContractInfo>;
  onChange: (isValid: boolean) => void;
}

function ValidateAddr ({ address, contracts_contractInfoOf, onChange, t }: Props): React.ReactElement<Props> | null {
  const [isAddress, setIsAddress] = useState(false);
  const [isStored, setIsStored] = useState(false);

  useEffect((): void => {
    try {
      keyring.decodeAddress(address || '');
      setIsAddress(true);
    } catch (error) {
      setIsAddress(false);
    }
  }, [address]);

  useEffect((): void => {
    setIsStored(!!contracts_contractInfoOf && contracts_contractInfoOf.isSome);
  }, [contracts_contractInfoOf]);

  useEffect((): void => {
    onChange(isAddress && isStored);
  }, [isAddress, isStored]);

  if (isStored || !isAddress) {
    return null;
  }

  return (
    <InfoForInput type='error'>
      {
        isAddress
          ? t('Unable to find deployed contract code at the specified address')
          : t('The value is not in a valid address format')
      }
    </InfoForInput>
  );
}

export default translate(
  withCalls<Props>(
    ['query.contracts.contractInfoOf', {
      fallbacks: ['query.contract.contractInfoOf'],
      paramName: 'address'
    }]
  )(ValidateAddr)
);
