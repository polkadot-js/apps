// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';

import React from 'react';
import { InputFile } from '@polkadot/react-components';

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

export default function File ({ className, isDisabled, isError = false, label, onChange, placeholder, style, withLabel }: Props): React.ReactElement<Props> {
  return (
    <Bare
      className={className}
      style={style}
    >
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
