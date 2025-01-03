// Copyright 2017-2025 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic, SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { RawParam, RawParamOnChange, RawParamOnEnter, RawParamOnEscape } from '../types.js';

import React, { useCallback } from 'react';

import { Extrinsic as BaseExtrinsic } from '../Named/index.js';

interface Props {
  className?: string;
  defaultArgs?: RawParam[];
  defaultValue: SubmittableExtrinsicFunction<'promise'>;
  isDisabled?: boolean;
  isError?: boolean;
  isPrivate: boolean;
  label: React.ReactNode;
  onChange?: RawParamOnChange;
  onEnter?: RawParamOnEnter;
  onEscape?: RawParamOnEscape;
  withLabel?: boolean;
}

function ExtrinsicDisplay ({ className = '', defaultArgs, defaultValue, isDisabled, isError, isPrivate, label, onChange, onEnter, onEscape, withLabel }: Props): React.ReactElement<Props> {
  const _onChange = useCallback(
    (value?: SubmittableExtrinsic<'promise'>) =>
      onChange && onChange({
        isValid: !!value,
        value
      }),
    [onChange]
  );

  return (
    <BaseExtrinsic
      className={className}
      defaultArgs={defaultArgs}
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      isError={isError}
      isPrivate={isPrivate}
      label={label}
      onChange={_onChange}
      onEnter={onEnter}
      onEscape={onEscape}
      withLabel={withLabel}
    />
  );
}

export default React.memo(ExtrinsicDisplay);
