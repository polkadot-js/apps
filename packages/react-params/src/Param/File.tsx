// Copyright 2017-2020 @polkadot/react-params authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { InputFile } from '@polkadot/react-components';

import Bare from './Bare';

interface Props {
  className?: string;
  defaultValue?: any;
  isDisabled?: boolean;
  isError?: boolean;
  label?: React.ReactNode;
  onChange?: (contents: Uint8Array) => void;
  placeholder?: string;
  withLabel?: boolean;
}

function File ({ className = '', isDisabled, isError = false, label, onChange, placeholder, withLabel }: Props): React.ReactElement<Props> {
  return (
    <Bare className={className}>
      <InputFile
        convertHex
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        onChange={onChange}
        placeholder={placeholder}
        withEllipsis
        withLabel={withLabel}
      />
    </Bare>
  );
}

export default React.memo(File);
