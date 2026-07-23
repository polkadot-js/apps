// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Link } from 'react-router-dom';

import { Button, Icon, Modal, styled } from '@polkadot/react-components';
import { useNotifications } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../../translate.js';
import { reviveElement } from './utils.js';

interface Props {
  className?: string;
  toggleModal: () => void;
}

const NotificationsModal = ({ className, toggleModal }: Props) => {
  const { t } = useTranslation();
  const { notifications, removeNotification } = useNotifications();

  const handleRemove = (id: string) => {
    removeNotification(id);
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
                className='notificationItem'
                key={notif.key}
              >
                <div className='notificationContent'>
                  <p className='notificationDescription'>
                    {reviveElement(notif.message)}{' '}
                    <span className='status'>({notif.status})</span>
                  </p>
                  <div className='meta'>
                    <p>
                      {notif.accountId && <span className='accountId'>{(notif.accountId)}</span>}
                      <span className='timestamp'>{new Date(notif.timestamp).toLocaleString()}</span>
                    </p>
                    {notif.blockNumber && (
                      <p className='--digits'>
                        <Link to={`/explorer/query/${notif.blockNumber}`}>{formatNumber(notif.blockNumber)}</Link>
                      </p>
                    )}
                  </div>
                </div>
                <div className='notificationActions'>
                  <Button
                    icon='trash'
                    isCircular
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={() => handleRemove(notif.key)}
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

      .status {
        text-transform: uppercase;
        font-size: 1rem;
        text-decoration: italic;
      }

      .meta {
        display: flex;
        flex-direction: column;
        align-items: end;
        font-size: 0.8rem;
        color: var(--text-secondary);

        .accountId {
          font-family: monospace;
          opacity: 0.8;
        }

        .timestamp {
          font-size: 0.75rem;
          opacity: 0.7;
        }
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
