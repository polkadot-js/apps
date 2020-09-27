// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo, useState } from 'react';
import { isUndefined } from '@polkadot/util';

export type FormField<T> = [
  T | null,
  boolean,
  (_?: T | null) => void
];

export default function useFormField<T> (defaultValue: T | null, validate: (_: T) => boolean = (): boolean => true): FormField<T> {
  const [value, setValue] = useState<T | null>(defaultValue);
  const isValid = useMemo(
    (): boolean => !!value && validate(value),
    [validate, value]
  );
  const setter = (value?: T | null) => !isUndefined(value) && setValue(value);

  return [
    value,
    isValid,
    setter
  ];
}
