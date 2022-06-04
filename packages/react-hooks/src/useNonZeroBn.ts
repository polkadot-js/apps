// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import { useMemo } from 'react';

import { BN_ZERO, bnToBn } from '@polkadot/util';

import { createNamedHook } from './createNamedHook';
import { FormField, useFormField } from './useFormField';

function isValid (value: BN): boolean {
  return !value.isZero();
}

function useNonZeroBnImpl (initialValue: BN | number = BN_ZERO): FormField<BN> {
  const value = useMemo(() => bnToBn(initialValue), [initialValue]);

  return useFormField(value, isValid);
}

export const useNonZeroBn = createNamedHook('useNonZeroBn', useNonZeroBnImpl);
