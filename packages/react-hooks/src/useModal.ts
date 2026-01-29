// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ModalState } from './types.js';

import { useCallback } from 'react';

import { createNamedHook } from './createNamedHook.js';
import { useToggle } from './useToggle.js';

function useModalImpl (defaultIsOpen?: boolean, onOpen?: () => void, onClose?: () => void): ModalState {
  const [isOpen, , setIsOpen] = useToggle(defaultIsOpen || false);
  const _onOpen = useCallback(
    (): void => {
      setIsOpen(true);

      onOpen && onOpen();
    },
    [onOpen, setIsOpen]
  );
  const _onClose = useCallback(
    (): void => {
      setIsOpen(false);

      onClose && onClose();
    },
    [onClose, setIsOpen]
  );

  return { isOpen, onClose: _onClose, onOpen: _onOpen };
}

export const useModal = createNamedHook('useModal', useModalImpl);
