// Copyright 2017-2019 @polkadot/app-transfer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ButtonProps } from './Button/types';
import { WithSubmittableButtonProps } from './types';

import React from 'react';

export default function withSubmittableButton<P extends WithSubmittableButtonProps> (Inner: React.ComponentType<P>): React.ComponentType<P> {
  return function WithSubmittableButton (props): React.ReactElement<P> {
    const _button = React.createRef<React.Component<ButtonProps>>();

    const onTextEnterKey = (): void => {
      if (_button && _button.current && _button.current.props && _button.current.props.onClick) {
        _button.current.props.onClick();
      }
    };

    return (
      <Inner
        {...props}
        submitButtonRef={_button}
        onTextEnterKey={onTextEnterKey}
      />
    );
  };
}
