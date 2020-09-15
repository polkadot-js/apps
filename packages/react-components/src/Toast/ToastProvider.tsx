// Copyright 2019-2020 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback, useState } from 'react';

import { ToastContext } from './Context';
import Toast from './Toast';

interface ToastProviderProps {
  children?: React.ReactNode;
}

const TOAST_TIMEOUT = 1500;

const ToastProvider = ({ children }: ToastProviderProps): React.ReactElement<ToastProviderProps> => {
  const [content, setContent] = useState('');
  const [visible, setVisible] = useState(false);

  const show = useCallback((message: string): () => void => {
    const timerId = setTimeout(() => setVisible(false), TOAST_TIMEOUT);

    setContent(message);
    setVisible(true);

    return (): void => clearTimeout(timerId);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <Toast
        content={content}
        visible={visible}
      />
    </ToastContext.Provider>
  );
};

export default ToastProvider;

ToastProvider.displayName = 'Toast';
