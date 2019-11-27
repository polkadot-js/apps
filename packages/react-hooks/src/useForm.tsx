// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FormProps } from '@polkadot/react-components/types';
import { ButtonProps } from '@polkadot/react-components/Button/types';

import { Component, createRef } from 'react';

export default function useForm (): FormProps {
  const cancelButtonRef = createRef<Component<ButtonProps>>();
  const submitButtonRef = createRef<Component<ButtonProps>>();

  const onInputEnterKey = (): void => {
    if (submitButtonRef &&
      submitButtonRef.current &&
      submitButtonRef.current.props &&
      submitButtonRef.current.props.onClick) {
      submitButtonRef.current.props.onClick();
    }
  };

  const onInputEscapeKey = (): void => {
    if (cancelButtonRef &&
      cancelButtonRef.current &&
      cancelButtonRef.current.props &&
      cancelButtonRef.current.props.onClick) {
      cancelButtonRef.current.props.onClick();
    }
  };

  return { cancelButtonRef, submitButtonRef, onInputEnterKey, onInputEscapeKey };
}
