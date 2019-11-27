// Copyright 2017-2019 @polkadot/app-transfer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TxButtonInterface, WithSubmittableButtonProps } from './types';
import React, { useRef } from 'react';

export default function withSubmittableButton<P extends WithSubmittableButtonProps>(Inner: React.ComponentType<P>): React.ComponentType<P> {
  return function (props: P): React.ReactElement<P> {
    const _button = useRef<HTMLButtonElement>(null);
    const _txButton = useRef<TxButtonInterface>(null);

    const onTextEnterKey = (): void => {
      if (_txButton && _txButton.current && _txButton.current.send) {
        _txButton.current.send()
      }

      if (_button && _button.current && _button.current.click) {
        _button.current.click();
      }
    }

    return (
      <Inner
        {...props}
        submitButtonRef={_button}
        txButtonRef={_txButton}
        onTextEnterKey={onTextEnterKey}
      />
    )
  }
}