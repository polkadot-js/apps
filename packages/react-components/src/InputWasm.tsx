// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InputFilePropsBase } from './InputFile';

import React, { useCallback } from 'react';

import { compactAddLength, isWasm } from '@polkadot/util';

import InputFile from './InputFile';

interface Props extends InputFilePropsBase {
  onChange: (contents: Uint8Array, isValid: boolean, name?: string) => void;
}

function InputWasm ({ onChange, ...props }: Props): React.ReactElement<Props> {
  const _onChange = useCallback(
    (wasm: Uint8Array, name: string): void => {
      const isValid = isWasm(wasm);

      onChange(compactAddLength(wasm), isValid, name);
    },
    [onChange]
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
