// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createNamedHook } from './createNamedHook';
import { FormField, useFormField } from './useFormField';

function isValid (value?: string | null): boolean {
  return (value && value.length > 0) || false;
}

function useNonEmptyStringImpl (initialValue = ''): FormField<string> {
  return useFormField(initialValue, isValid);
}

export const useNonEmptyString = createNamedHook('useNonEmptyString', useNonEmptyStringImpl);
