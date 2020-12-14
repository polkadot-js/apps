// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

import { BN_ZERO } from '@polkadot/util';

import { FormField, useFormField } from './useFormField';

export function useNonZeroBn (initialValue: BN = BN_ZERO): FormField<BN> {
  return useFormField(
    initialValue,
    (value: BN): boolean => !value.isZero()
  );
}
