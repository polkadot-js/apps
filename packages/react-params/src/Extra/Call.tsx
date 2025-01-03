// Copyright 2017-2025 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic, SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { Call } from '@polkadot/types/interfaces';
import type { Props, RawParam } from '../types.js';

import React, { useState } from 'react';

import { useApi } from '@polkadot/react-hooks';
import { isObject, isString } from '@polkadot/util';

import Extrinsic from './Extrinsic.js';

function isCall (f: unknown): f is Call {
  return isString((f as Call).section) && isString((f as Call).method);
}

function isSubmittable (f: unknown): f is SubmittableExtrinsic<'promise'> {
  return isObject((f as SubmittableExtrinsic<'promise'>).method) && isString((f as SubmittableExtrinsic<'promise'>).method.section) && isString((f as SubmittableExtrinsic<'promise'>).method.method);
}

function mapArgs (args: unknown[]): RawParam[] {
  return args.map((value) => ({
    isValid: true,
    value
  }));
}

export function extractInitial (api: ApiPromise, initialValue: SubmittableExtrinsicFunction<'promise'>, input?: RawParam): { initialArgs?: RawParam[], initialValue: SubmittableExtrinsicFunction<'promise'> } {
  try {
    return input?.value
      ? isCall(input.value)
        ? {
          initialArgs: mapArgs(input.value.args),
          initialValue: api.tx[input.value.section][input.value.method]
        }
        : isSubmittable(input.value)
          ? {
            initialArgs: mapArgs(input.value.method.args),
            initialValue: api.tx[input.value.method.section][input.value.method.method]
          }
          : { initialValue: (input.value as SubmittableExtrinsicFunction<'promise'>) }
      : { initialValue };
  } catch {
    return { initialValue };
  }
}

function CallDisplay ({ className = '', defaultValue, isDisabled, isError, label, onChange, onEnter, onEscape, withLabel }: Props): React.ReactElement<Props> {
  const { api, apiDefaultTx } = useApi();

  const [{ initialArgs, initialValue }] = useState(
    () => extractInitial(api, apiDefaultTx, defaultValue)
  );

  return (
    <Extrinsic
      className={className}
      defaultArgs={initialArgs}
      defaultValue={initialValue}
      isDisabled={isDisabled}
      isError={isError}
      isPrivate={false}
      label={label}
      onChange={onChange}
      onEnter={onEnter}
      onEscape={onEscape}
      withLabel={withLabel}
    />
  );
}

export default React.memo(CallDisplay);
