// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';
import type { Notification } from '../ctx/Notifications.js';

export const NOTIFICATION_PANEL_KEY = 'polkadot-app:notifications';

export const getNotificationsFromStorage = (genesisHash: HexString): Notification[] => {
  try {
    const allNotificationsStr = localStorage.getItem(NOTIFICATION_PANEL_KEY);

    if (!allNotificationsStr) {
      return [];
    }

    const allNotifications = JSON.parse(allNotificationsStr) as Record<string, Notification[]>;

    return allNotifications[genesisHash] ?? [];
  } catch {
    return [];
  }
};

export const saveNotificationToStorage = (genesisHash: HexString, notification: Notification): void => {
  try {
    const prevNotifications = getNotificationsFromStorage(genesisHash);

    const allNotificationsStr = localStorage.getItem(NOTIFICATION_PANEL_KEY) ?? '{}';
    const allNotifications = JSON.parse(allNotificationsStr) as Record<string, Notification[]>;

    allNotifications[genesisHash] = [notification, ...prevNotifications];

    localStorage.setItem(NOTIFICATION_PANEL_KEY, JSON.stringify(allNotifications));
  } catch (e) {
    console.log(e);
  }
};

export const removeNotificationFromStorage = (genesisHash: HexString, key: string): void => {
  try {
    const prevNotifications = getNotificationsFromStorage(genesisHash);

    const allNotificationsStr = localStorage.getItem(NOTIFICATION_PANEL_KEY) ?? '{}';
    const allNotifications = JSON.parse(allNotificationsStr) as Record<string, Notification[]>;

    allNotifications[genesisHash] = prevNotifications.filter((p) => p.key !== key);

    localStorage.setItem(NOTIFICATION_PANEL_KEY, JSON.stringify(allNotifications));
  } catch { }
};
