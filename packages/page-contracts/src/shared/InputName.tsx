// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { VoidFn } from '@polkadot/react-components/types';

import React from 'react';
import { Input } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  isBusy?: boolean;
  isContract?: boolean;
  isError?: boolean;
  isDisabled?: boolean;
  onChange: (_: string) => void;
  onEnter?: VoidFn;
  value?: string;
}

function InputName ({ className, isBusy, isContract, isError, onChange, onEnter, value = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Input
      className={className}
      help={t<string>(
        isContract
          ? 'A name for the deployed contract to help users distinguish. Only used for display purposes.'
          : 'A name for this WASM code to help users distinguish. Only used for display purposes.'
      )}
      isDisabled={isBusy}
      isError={isError}
      label={t<string>(
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
