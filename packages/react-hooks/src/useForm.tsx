// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FormProps } from '@polkadot/react-components/types';

import { useRef } from 'react';

export default function useForm (onSubmit: () => void, onCancel: () => void = () => null): FormProps {
  const onCancelRef = useRef<() => void | Promise<void>>(onCancel);
  const onSubmitRef = useRef<() => void | Promise<void>>(onSubmit);

  const onInputEnterKey = (): void => {
    onSubmitRef.current && onSubmitRef.current();
  };

  const onInputEscapeKey = (): void => {
    onCancelRef.current && onCancelRef.current();
  };

  return { onCancelRef, onSubmitRef, onInputEnterKey, onInputEscapeKey };
}
