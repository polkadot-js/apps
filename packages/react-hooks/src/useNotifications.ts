// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { NotificationContextType } from './ctx/Notifications.js';

import { useContext } from 'react';

import { NotificationContext } from './ctx/Notifications.js';
import { createNamedHook } from './createNamedHook.js';

const useNotificationsImpl = (): NotificationContextType => {
  const ctx = useContext(NotificationContext);

  if (!ctx) {
    throw new Error('useNotifications must be used inside NotificationProvider');
  }

  return ctx;
};

export const useNotifications = createNamedHook('useNotifications', useNotificationsImpl);
