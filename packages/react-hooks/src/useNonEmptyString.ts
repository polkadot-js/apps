// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FormField, useFormField } from './useFormField';

export function useNonEmptyString (initialValue = ''): FormField<string> {
  return useFormField(
    initialValue,
    (value?: string | null): boolean => (value && value.length > 0) || false
  );
}
