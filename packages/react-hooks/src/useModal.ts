// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ModalState } from './types';

import { useRef, useState } from 'react';

export default function useModal (defaultIsOpen?: boolean, onOpen?: () => void, onClose?: () => void): ModalState {
  const [isOpen, setIsOpen] = useState(defaultIsOpen || false);

  const onOpenRef = useRef((): void => {
    setIsOpen(true);

    onOpen && onOpen();
  });

  const onCloseRef = useRef((): void => {
    setIsOpen(false);

    onClose && onClose();
  });

  return {
    isOpen,
    onOpen: (): void => onOpenRef.current(),
    onClose: (): void => onCloseRef.current()
  };
}
