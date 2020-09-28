// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';
import { compactAddLength, isWasm } from '@polkadot/util';

import InputFile, { InputFileProps } from './InputFile';

interface Props extends Omit<InputFileProps, 'accept'> {
  isValidRef: React.MutableRefObject<boolean>;
  onChange: (contents: Uint8Array, name?: string) => void;
}

function InputWasm ({ isValidRef, onChange, ...props }: Props): React.ReactElement<Props> {
  const _onChange = useCallback(
    (wasm: Uint8Array, name: string): void => {
      isValidRef.current = isWasm(wasm);
      onChange(compactAddLength(wasm), name);
    },
    [isValidRef, onChange]
  );

  return (
    <InputFile
      {...props}
      accept='application/wasm'
      onChange={_onChange}
    />
  );
}

export default React.memo(InputWasm);
