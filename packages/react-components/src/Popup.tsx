// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Popup as SUIPopup } from 'semantic-ui-react';

interface Props {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
  trigger?: React.ReactNode;
}

function Popup ({ children, className, isOpen, onClose, trigger }: Props): React.ReactElement<Props> {
  return (
    <SUIPopup
      className={className}
      onClose={onClose}
      open={isOpen}
      position='bottom right'
      trigger={trigger}
    >
      {children}
    </SUIPopup>
  );
}

export default React.memo(Popup);
