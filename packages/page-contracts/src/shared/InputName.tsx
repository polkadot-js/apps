// Copyright 2017-2025 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Input } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  isBusy?: boolean;
  isContract?: boolean;
  isError?: boolean;
  isDisabled?: boolean;
  onChange: (_: string) => void;
  onEnter?: () => void;
  value?: string;
}

function InputName ({ className, isBusy, isContract, isError, onChange, onEnter, value = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Input
      className={className}
      isDisabled={isBusy}
      isError={isError}
      label={t(
        isContract
          ? 'contract name'
          : 'code bundle name'
      )}
      onChange={onChange}
      onEnter={onEnter}
      value={value}
    />
  );
}

export default React.memo(InputName);
