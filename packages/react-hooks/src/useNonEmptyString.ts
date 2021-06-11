// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FormField, useFormField } from './useFormField';

function isValid (value?: string | null): boolean {
  return (value && value.length > 0) || false;
}

export function useNonEmptyString (initialValue = ''): FormField<string> {
  return useFormField(initialValue, isValid);
}
