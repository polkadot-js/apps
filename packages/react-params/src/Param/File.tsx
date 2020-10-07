// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from '@canvas-ui/react-components/types';

import React from 'react';
import { InputFile } from '@canvas-ui/react-components';

import Bare from './Bare';

interface Props extends BareProps {
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
