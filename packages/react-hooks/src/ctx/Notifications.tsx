// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { QueueTxStatus } from '@polkadot/react-components/Status/types';
import type { HexString } from '@polkadot/util/types';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { getNotificationsFromStorage, removeNotificationFromStorage, saveNotificationToStorage } from '../utils/notifications.js';

export interface Notification {
  blockNumber?: number
  key: string;
  message: ReactNode;
  status: QueueTxStatus;
  accountId?: string | null;
  timestamp: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (item: Omit<Notification, 'timestamp'>) => void;
  removeNotification: (key: string) => void;
  setGenesisHash: Dispatch<SetStateAction<HexString>>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationCtxRoot: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [genesisHash, setGenesisHash] = useState<HexString>('0x');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((item: Omit<Notification, 'timestamp'>) => {
    saveNotificationToStorage(genesisHash, { ...item, timestamp: Date.now() });
    setNotifications(getNotificationsFromStorage(genesisHash));
  }, [genesisHash]);

  const removeNotification = useCallback((key: string) => {
    removeNotificationFromStorage(genesisHash, key);
    setNotifications(getNotificationsFromStorage(genesisHash));
  }, [genesisHash]);

  const value = useMemo(
    () => ({ addNotification, notifications, removeNotification, setGenesisHash }),
    [addNotification, notifications, removeNotification]
  );

  // IT IS SAFE: This won't trigger unnecessary re-renders when notifications are added or removed.
  // Since `genesisHash` is the only dependency, it will only re-run when the chain changes or the app reloads.
  useEffect(() => {
    setNotifications(getNotificationsFromStorage(genesisHash));
  }, [genesisHash]);

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
