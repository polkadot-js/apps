// Copyright 2017-2021 @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import useFormField, { FormField } from './useFormField';

export default function useNonEmptyString (initialValue = ''): FormField<string> {
  return useFormField(
    initialValue,
    (value?: string | null): boolean => (value && value.length > 0) || false
  );
}
