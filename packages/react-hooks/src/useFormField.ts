// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useMemo, useState } from 'react';

import { isUndefined } from '@polkadot/util';

export type FormField<T> = [
  T | null,
  boolean,
  (_?: T | null) => void
];

type ValidateFn<T> = (_: T) => boolean;

const defaultValidate = (): boolean => true;

// FIXME Since we use generics, this cannot be a createNamedHook as of yet
export function useFormField<T> (defaultValue: T | null, validate: ValidateFn<T> = defaultValidate): FormField<T> {
  const [value, setValue] = useState<T | null>(defaultValue);
  const isValid = useMemo(
    () => !!value && validate(value),
    [validate, value]
  );
  const setter = useCallback(
    (value?: T | null) => !isUndefined(value) && setValue(value),
    []
  );

  return [value, isValid, setter];
}
