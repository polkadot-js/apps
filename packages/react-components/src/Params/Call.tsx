// Copyright 2017-2022 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic, SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { Props, RawParam } from '@polkadot/react-params/types';
import type { Call } from '@polkadot/types/interfaces';

import React, { useState } from 'react';

import { useApi } from '@polkadot/react-hooks';
import { isObject, isString } from '@polkadot/util';

import Extrinsic from './Extrinsic';

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

function CallDisplay ({ className = '', defaultValue, isDisabled, isError, label, onChange, onEnter, onEscape, withLabel }: Props): React.ReactElement<Props> {
  const { api, apiDefaultTx } = useApi();

  const [{ initialArgs, initialValue }] = useState(
    (): { initialArgs?: RawParam[], initialValue: SubmittableExtrinsicFunction<'promise'> } => {
      try {
        return defaultValue && defaultValue.value
          ? isCall(defaultValue.value)
            ? {
              initialArgs: mapArgs(defaultValue.value.args),
              initialValue: api.tx[defaultValue.value.section][defaultValue.value.method]
            }
            : isSubmittable(defaultValue.value)
              ? {
                initialArgs: mapArgs(defaultValue.value.method.args),
                initialValue: api.tx[defaultValue.value.method.section][defaultValue.value.method.method]
              }
              : { initialValue: (defaultValue.value as SubmittableExtrinsicFunction<'promise'>) }
          : { initialValue: api.tx.balances.transfer };
      } catch (error) {
        return { initialValue: apiDefaultTx };
      }
    }
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
