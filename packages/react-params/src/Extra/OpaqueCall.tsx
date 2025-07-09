// Copyright 2017-2025 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { Props, RawParam } from '../types.js';

import React, { useCallback, useState } from 'react';

import { useApi } from '@polkadot/react-hooks';

import { extractInitial } from './Call.js';
import ExtrinsicDisplay from './Extrinsic.js';

function OpaqueCall ({ className = '', defaultValue, isDisabled, isError, label, onChange, onEnter, onEscape, withLabel }: Props): React.ReactElement<Props> {
  const { api, apiDefaultTxSudo } = useApi();

  const [{ initialArgs, initialValue }] = useState(
    () => extractInitial(api, apiDefaultTxSudo, defaultValue)
  );

  const _onChange = useCallback(
    ({ isValid, value }: RawParam): void => {
      let callData = null;

      if (isValid && value) {
        callData = (value as SubmittableExtrinsic<'promise'>).method.toHex();
      }

      onChange && onChange({
        isValid,
        value: callData
      });
    },
    [onChange]
  );

  return (
    <ExtrinsicDisplay
      className={className}
      defaultArgs={initialArgs}
      defaultValue={initialValue}
      isDisabled={isDisabled}
      isError={isError}
      isPrivate
      label={label}
      onChange={_onChange}
      onEnter={onEnter}
      onEscape={onEscape}
      withLabel={withLabel}
    />
  );
}

export default React.memo(OpaqueCall);
