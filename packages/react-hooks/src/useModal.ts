// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ModalState } from './types';

import useToggle from './useToggle';

export default function useModal (defaultIsOpen?: boolean, onOpen?: () => void, onClose?: () => void): ModalState {
  const [isOpen, , setIsOpen] = useToggle(defaultIsOpen || false);

  return {
    isOpen,
    onOpen: (): void => {
      setIsOpen(true);

      onOpen && onOpen();
    },
    onClose: (): void => {
      setIsOpen(false);

      onClose && onClose();
    }
  };
}
