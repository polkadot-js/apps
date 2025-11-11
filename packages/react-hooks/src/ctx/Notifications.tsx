// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { QueueTx } from '@polkadot/react-components/Status/types';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { useQueue } from '@polkadot/react-hooks';

interface Notification {
  key: string;
  message: string;
  status: QueueTx['status'];
  accountId?: string | null;
  timestamp: number;
}

interface NotificationContextType {
  notifications: Notification[];
  removeNotification: (key: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { txqueue } = useQueue();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Create a stable key per tx
  const getTxKey = (tx: QueueTx): string => {
    if (tx.extrinsic?.hash) {
      return tx.extrinsic.hash.toHex();
    }

    if (tx.payload?.method) {
      return `${tx.payload.method}-${tx.accountId ?? ''}`;
    }

    return `temp-${tx.id}`; // fallback (short-lived)
  };

  useEffect(() => {
    const currentKeys = txqueue.map(getTxKey);
    const knownKeys = notifications.map((n) => n.key);

    // Add new tx notifications
    const newTxs = txqueue.filter((tx) => !knownKeys.includes(getTxKey(tx)));
    const addedNotifications = newTxs.map((tx) => ({
      accountId: tx.accountId,
      key: getTxKey(tx),
      message: `Transaction queued (${tx.status})`,
      status: tx.status,
      timestamp: Date.now()
    }));

    // Remove notifications for txs no longer in queue
    const stillActive = notifications.filter((n) => currentKeys.includes(n.key));

    if (addedNotifications.length > 0 || stillActive.length !== notifications.length) {
      setNotifications([...stillActive, ...addedNotifications]);
    }
  }, [notifications, txqueue]);

  const removeNotification = (key: string) => {
    setNotifications((prev) => prev.filter((n) => n.key !== key));
  };

  const value = useMemo(
    () => ({ notifications, removeNotification }),
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
