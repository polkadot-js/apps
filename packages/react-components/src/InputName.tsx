// Copyright 2017-2021 @polkadot/react-components authors & contributors
// and @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { VoidFn } from '@canvas-ui/react-util/types';
import React from 'react';

import Input from './Input';
import { useTranslation } from './translate';
import { BareProps } from './types';

interface Props extends BareProps {
  isBusy?: boolean;
  isContract?: boolean;
  isError?: boolean;
  isDisabled?: boolean;
  onChange: (_: string) => void;
  onEnter?: VoidFn;
  placeholder?: string;
  value?: string;
}

function InputName ({ className, isBusy, isContract, isError, onChange, onEnter, value = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Input
      className={className}
      help={t(
        isContract
          ? 'A name for the instantiated contract to help users distinguish. Only used for display purposes.'
          : 'A name for this WASM code to help users distinguish. Only used for display purposes.'
      )}
      isDisabled={isBusy}
      isError={isError}
      label={t(
        isContract
          ? 'Contract Name'
          : 'Code Bundle Name'
      )}
      onChange={onChange}
      onEnter={onEnter}
      placeholder={t(
        isContract
          ? 'Give your contract a descriptive name'
          : 'Give your code bundle a descriptive name'
      )}
      value={value}
    />
  );
}

export default React.memo(InputName);
