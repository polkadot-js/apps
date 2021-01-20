// Copyright 2017-2021 @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

import { BN_ZERO } from '@polkadot/util';

import useFormField, { FormField } from './useFormField';

export default function useNonZeroBn (initialValue: BN = BN_ZERO): FormField<BN> {
  return useFormField(
    initialValue,
    (value: BN): boolean => !value.isZero()
  );
}
