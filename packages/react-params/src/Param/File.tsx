// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { InputFile } from '@polkadot/react-components';

import Bare from './Bare.js';

interface Props {
  className?: string;
  defaultValue?: unknown;
  isDisabled?: boolean;
  isError?: boolean;
  label?: React.ReactNode;
  labelExtra?: React.ReactNode;
  onChange?: (contents: Uint8Array) => void;
  placeholder?: string;
  withLabel?: boolean;
}

function File ({ className = '', isDisabled, isError = false, label, labelExtra, onChange, placeholder, withLabel }: Props): React.ReactElement<Props> {
  return (
    <Bare className={className}>
      <InputFile
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        labelExtra={labelExtra}
        onChange={onChange}
        placeholder={placeholder}
        withEllipsis
        withLabel={withLabel}
      />
    </Bare>
  );
}

export default React.memo(File);
