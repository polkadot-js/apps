// Copyright 2017-2020 @canvas-ui/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useCallback, useMemo, useState, useRef } from 'react';

export type FormField<T> = [
  T | null,
  (_?: T | null) => void,
  boolean,
  boolean,
  boolean
];

export default function useFormField<T> (defaultValue: T | null, validate: (_: T) => boolean = (): boolean => true): FormField<T> {
  const [value, setValue] = useState<T | null>(defaultValue);
  const isTouched = useRef(false);

  const isValid = useMemo(
    (): boolean => !!value && validate(value),
    [validate, value]
  );
  const setter = useCallback(
    (value?: T | null) => {
      if (!isTouched.current) {
        isTouched.current = true;
      }

      setValue(value || null);
    },
    []
  );

  return [
    value,
    setter,
    isValid,
    isTouched.current && !isValid,
    isTouched.current
  ];
}
