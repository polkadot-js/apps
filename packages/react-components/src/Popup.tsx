// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PopupProps } from 'semantic-ui-react';

import React from 'react';
import { Popup as SUIPopup } from 'semantic-ui-react';

interface Props {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
  on?: PopupProps['on'];
  onClose?: () => void;
  position?: PopupProps['position'];
  trigger?: React.ReactNode;
}

function Popup ({ children, className = '', isOpen, on = 'click', onClose, position = 'bottom right', trigger }: Props): React.ReactElement<Props> {
  return (
    <SUIPopup
      className={className}
      on={on}
      onClose={onClose}
      open={isOpen}
      position={position}
      trigger={trigger}
    >
      {children}
    </SUIPopup>
  );
}

export default React.memo(Popup);
