// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Button$OnClick } from '@polkadot/react-components/Button/types';
import { FormProps } from '@polkadot/react-components/types';

import { useRef } from 'react';

export default function useForm (onSubmit: () => void, onCancel: () => void = (): void => {}): FormProps {
  const onCancelRef = useRef<Button$OnClick>(onCancel);
  const onSubmitRef = useRef<Button$OnClick>(onSubmit);

  return {
    onCancel: (): void => {
      onCancelRef.current && onCancelRef.current();
    },
    onSubmit: (): void => {
      onSubmitRef.current && onSubmitRef.current();
    }
  };
}
