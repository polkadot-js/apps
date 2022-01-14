// Copyright 2017-2022 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic, SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { RawParamOnChange, RawParamOnEnter, RawParamOnEscape } from '@polkadot/react-params/types';

import React, { useCallback } from 'react';

import BaseExtrinsic from '../Extrinsic';

interface Props {
  className?: string;
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

function ExtrinsicDisplay ({ className = '', defaultValue, isDisabled, isError, isPrivate, label, onChange, onEnter, onEscape, withLabel }: Props): React.ReactElement<Props> {
  const _onChange = useCallback(
    (method?: SubmittableExtrinsic<'promise'>): void =>
      onChange && onChange({
        isValid: !!method,
        value: method
      }),
    [onChange]
  );

  return (
    <BaseExtrinsic
      className={className}
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
