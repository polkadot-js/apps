// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { compactAddLength } from '@polkadot/util';
import InputFile, { InputFileProps } from './InputFile';

interface Props extends Omit<InputFileProps, 'accept'> {
  isValidRef: React.MutableRefObject<boolean>;
  onChange: (contents: Uint8Array, name?: string) => void;
}

export default function InputWasm ({ isValidRef, onChange, ...props }: Props): React.ReactElement<Props> {
  const _onChange = (wasm: Uint8Array, name: string): void => {
    const isWasmValid = wasm.subarray(0, 4).toString() === '0,97,115,109'; // '\0asm'

    isValidRef.current = isWasmValid;
    onChange(compactAddLength(wasm), name);
  };

  return (
    <InputFile
      {...props}
      accept='application/wasm'
      onChange={_onChange}
    />
  );
}
