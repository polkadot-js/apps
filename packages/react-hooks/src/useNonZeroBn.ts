// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import useFormField, { FormField } from './useFormField';

export default function useNonZeroBn (initialValue: BN = ZERO): FormField<BN> {
  return useFormField(
    initialValue,
    (value: BN): boolean => !value.isZero()
  );
}
