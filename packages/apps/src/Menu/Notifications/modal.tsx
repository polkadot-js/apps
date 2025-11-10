// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Button, Icon, Modal, styled } from '@polkadot/react-components';

import { useTranslation } from '../../translate.js';

interface NotificationItem {
  id: number;
  title: string;
  description: string;
  blockNumber?: number;
  isRead: boolean;
}

interface Props {
  className?: string;
  toggleModal: () => void;
}

const NotificationsModal = ({ className, toggleModal }: Props) => {
  const { t } = useTranslation();

  // --- Static Data for now ---
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      blockNumber: 18402340,
      description: 'Your transfer of 12.3 DOT was included in block.',
      id: 1,
      isRead: false,
      title: 'Transaction Successful'
    },
    {
      description: 'You have received staking rewards.',
      id: 2,
      isRead: true,
      title: 'Validator Payout'
    },
    {
      blockNumber: 18399010,
      description: 'Your contribution has been refunded.',
      id: 3,
      isRead: false,
      title: 'Crowdloan Update'
    }
  ]);

  const handleToggleRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const handleRemove = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <Modal
      className={`${className} notifications-Modal`}
      header={t('Notifications')}
      onClose={toggleModal}
      size='large'
    >
      <div className='notificationsList'>
        {notifications.length === 0
          ? (
            <div className='emptyState'>
              <Icon icon='bell' />
              <p>{t('No notifications')}</p>
            </div>
          )
          : (
            notifications.map((notif) => (
              <div
                className={`notificationItem ${notif.isRead ? 'read' : 'unread'}`}
                key={notif.id}
              >
                <div className='notificationContent'>
                  <p className='notificationDescription'>{notif.description}</p>
                  {notif.blockNumber && (
                    <span className='blockNumber'>
                      #{notif.blockNumber.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className='notificationActions'>
                  <Button
                    icon={notif.isRead ? 'eye-slash' : 'eye'}
                    isCircular
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={() => handleToggleRead(notif.id)}
                    tooltip={notif.isRead ? t('Mark as unread') : t('Mark as read')}
                  />
                  <Button
                    icon='trash'
                    isCircular
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={() => handleRemove(notif.id)}
                    tooltip={t('Remove')}
                  />
                </div>
              </div>
            ))
          )}
      </div>
    </Modal>
  );
};

export default React.memo(styled(NotificationsModal)`
  .ui--Modal-Header {
    align-items: center;
    
    h1 {
      text-transform: capitalize;
    }
  }

  .notificationsList {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    padding: 0.75rem 0.5rem 0.5rem;
  }

  .notificationItem {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--bg-table);
    border: 1px solid var(--border-table);
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    transition: background 0.15s ease-in-out;

    &.unread {
      border-left: 3px solid var(--accent-color);
    }

    &:hover {
      background: rgba(255, 255, 255, 0.6);

      .notificationActions {
        opacity: 1;
        pointer-events: all;
      }
    }

    .notificationContent {
      flex: 1;
      margin-right: 0.5rem;

      display: flex;
      align-items: center;
      justify-content: space-between;

      .blockNumber {
        font-size: 0.85rem;
        color: var(--text-secondary);
      }

      p {
        margin: 0;
        font-size: 1rem;
        color: var(--text-secondary);
      }
    }

    .notificationActions {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.15s ease-in-out;
    }
  }

  .emptyState {
    text-align: center;
    color: var(--text-secondary);
    padding: 2rem 0;

    > .ui--Icon {
      margin-bottom: 0.5rem;
      scale: 1.5;
    }
  }
`);
