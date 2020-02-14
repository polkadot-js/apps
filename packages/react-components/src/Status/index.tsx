// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueueStatus, QueueTx, QueueTxStatus } from './types';

import React from 'react';
import styled from 'styled-components';
import { registry } from '@polkadot/react-api';

import AddressMini from '../AddressMini';
import Button from '../Button';
import Icon from '../Icon';
import { useTranslation } from '../translate';
import { classes } from '../util';
import StatusContext from './Context';
import { STATUS_COMPLETE } from './constants';

export { StatusContext };

interface Props {
  className?: string;
  stqueue?: QueueStatus[];
  txqueue?: QueueTx[];
}

function iconName (status: string): any {
  switch (status) {
    case 'error':
      return 'ban';

    case 'event':
      return 'assistive listening devices';

    case 'received':
      return 'telegram plane';

    default:
      return 'check';
  }
}

function signerIconName (status: QueueTxStatus): any {
  switch (status) {
    case 'cancelled':
      return 'ban';

    case 'completed':
    case 'inblock':
    case 'finalized':
    case 'sent':
      return 'check';

    case 'dropped':
    case 'retracted':
    case 'invalid':
    case 'usurped':
      return 'arrow down';

    case 'error':
    case 'finalitytimeout':
      return 'warning sign';

    case 'queued':
      return 'random';

    default:
      return 'spinner';
  }
}

function renderStatus ({ account, action, id, message, removeItem, status }: QueueStatus): React.ReactNode {
  return (
    <div
      className={classes('item', status)}
      key={id}
    >
      <div className='wrapper'>
        <div className='container'>
          <Icon
            name='close'
            onClick={removeItem}
          />
          <div className='short'>
            <Icon name={iconName(status)} />
          </div>
          <div className='desc'>
            <div className='header'>
              {action}
            </div>
            {account && (
              <AddressMini value={account} />
            )}
            <div className='status'>
              {message}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderItem ({ id, extrinsic, error, removeItem, rpc, status }: QueueTx): React.ReactNode {
  let { method, section } = rpc;

  if (extrinsic) {
    const found = registry.findMetaCall(extrinsic.callIndex);

    if (found.section !== 'unknown') {
      method = found.method;
      section = found.section;
    }
  }

  const icon = signerIconName(status);

  return (
    <div
      className={classes('item', status)}
      key={id}
    >
      <div className='wrapper'>
        <div className='container'>
          {STATUS_COMPLETE.includes(status) && (
            <Icon
              name='close'
              onClick={removeItem}
            />
          )}
          <div className='short'>
            <Icon
              loading={icon === 'spinner'}
              name={icon}
            />
          </div>
          <div className='desc'>
            <div className='header'>
              {section}.{method}
            </div>
            <div className='status'>
              {error ? error.message : status}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Status ({ className, stqueue = [], txqueue = [] }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const allst: QueueStatus[] = stqueue.filter(({ isCompleted }): boolean => !isCompleted);
  const alltx: QueueTx[] = txqueue.filter(({ status }): boolean =>
    !['completed', 'incomplete'].includes(status)
  );
  const completedTx = alltx.filter(({ status }): boolean => STATUS_COMPLETE.includes(status));

  if (!allst.length && !alltx.length) {
    return null;
  }

  const _onDismiss = (): void => {
    allst.map((s): void => s.removeItem());
    completedTx.map((t): void => t.removeItem());
  };

  return (
    <div className={`ui--Status ${className}`}>
      {(allst.length + completedTx.length) > 1 && (
        <div className='dismiss'>
          <Button
            isFluid
            isNegative
            onClick={_onDismiss}
            label={t('Dismiss all notifications')}
            icon='cancel'
          />
        </div>
      )}
      {alltx.map(renderItem)}
      {allst.map(renderStatus)}
    </div>
  );
}

export default styled(Status)`
  display: inline-block;
  position: fixed;
  right: 0.25rem;
  top: 0.25rem;
  width: 23rem;
  z-index: 1001;

  .dismiss {
    margin-bottom: 0.25rem;
  }

  .item {
    display: block;

    > .wrapper > .container {
      align-items: center;
      background: #00688b;
      border-radius: $small-corner;
      color: white;
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
      padding: 0 0.5rem;
      opacity: 0.95;
      vertical-align: middle;
      position: relative;

      .desc {
        flex: 1;
        overflow: hidden;
        padding: 0.5rem 1rem;

        .status {
          font-weight: 700;
        }

        .ui--AddressMini {
          .ui--AddressMini-address {
            min-width: 0;
            text-align: left;
          }
        }
      }

      .header {
        opacity: 0.66;
      }

      .short {
        font-size: 2.5rem;
        opacity:  0.75;
        padding: 0.5rem 0 0.5rem 0.5rem;

        i.icon {
          line-height: 1;
        }
      }

      .padded {
        padding: 0.25rem 0 0 0 !important;
      }

      i.close {
        position: absolute;
        top: 0.25rem;
        right: 0rem;
        cursor: pointer;
      }
    }

    &.cancelled > .wrapper > .container {
      background: #cd9b1d
    }

    &.event > .wrapper > .container {
      background: teal;
    }

    &.completed,
    &.finalized,
    &.inblock,
    &.sent,
    &.success {
      & > .wrapper > .container {
        background: green;
      }
    }

    &.dropped,
    &.error,
    &.finalitytimeout,
    &.invalid,
    &.retracted,
    &.usurped {
      & > .wrapper > .container {
        background: red;
      }
    }
  }
`;
