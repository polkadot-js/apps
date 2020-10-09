// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ContractInfo } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import { Option } from '@polkadot/types';
import { useApi, useCall } from '@polkadot/react-hooks';
import { InfoForInput } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';

import { useTranslation } from '../translate';

interface Props {
  address?: string | null;
  onChange: (isValid: boolean) => void;
}

function ValidateAddr ({ address, onChange }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const contractInfo = useCall<Option<ContractInfo>>(api.query.contracts.contractInfoOf, [address]);
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
    setIsStored(!!contractInfo?.isSome);
  }, [contractInfo]);

  useEffect((): void => {
    onChange(isAddress && isStored);
  }, [isAddress, isStored, onChange]);

  if (isStored || !isAddress) {
    return null;
  }

  return (
    <InfoForInput type='error'>
      {isAddress
        ? t<string>('Unable to find deployed contract code at the specified address')
        : t<string>('The value is not in a valid address format')
      }
    </InfoForInput>
  );
}

export default React.memo(ValidateAddr);
