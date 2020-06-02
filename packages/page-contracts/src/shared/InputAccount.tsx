// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StringOrNull } from '@polkadot/react-components/types';

import React from 'react';
import { InputAddress } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  isDisabled?: boolean;
  onChange: (_: StringOrNull) => void;
  value?: StringOrNull;
}

function InputAccount ({ className, isDisabled, onChange, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <InputAddress
      className={className}
      help={t('Specify the user account to use for this deployment. And fees will be deducted from this account.')}
      isDisabled={isDisabled}
      isInput={false}
      label={t('deployment account')}
      onChange={onChange}
      type='account'
      value={value}
    />
  );
}

export default React.memo(InputAccount);
