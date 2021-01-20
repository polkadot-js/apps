// Copyright 2017-2021 @canvas-ui/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { InputFile } from '@canvas-ui/react-components';
import React from 'react';

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
