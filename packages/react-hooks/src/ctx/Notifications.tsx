// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { QueueTxStatus } from '@polkadot/react-components/Status/types';

import React, { createContext, useContext, useMemo, useState } from 'react';

interface Notification {
  blockNumber?: number
  key: string;
  message: string;
  status: QueueTxStatus;
  accountId?: string | null;
  timestamp: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (item: Notification) => void;
  removeNotification: (key: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationCtxRoot: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (item: Notification) => {
    setNotifications((prev) => [...prev, item]);
  };

  const removeNotification = (key: string) => {
    setNotifications((prev) => prev.filter((n) => n.key !== key));
  };

  const value = useMemo(
    () => ({ addNotification, notifications, removeNotification }),
    [notifications]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const ctx = useContext(NotificationContext);

  if (!ctx) {
    throw new Error('useNotifications must be used inside NotificationProvider');
  }

  return ctx;
};
