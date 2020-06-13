// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import useFormField, { FormField } from './useFormField';

export default function useNonEmptyString (initialValue = ''): FormField<string> {
  return useFormField(
    initialValue,
    (value?: string | null): boolean => (value && value.length > 0) || false
  );
}
