// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { QueueStatus, QueueTx, QueueTxStatus } from './types';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { IconName } from '@fortawesome/fontawesome-svg-core';

import AddressMini from '../AddressMini';
import Button from '../Button';
import Icon from '../Icon';
import Spinner from '../Spinner';
import { useTranslation } from '../translate';
import { classes } from '../util';
import StatusContext from './Context';
import { STATUS_COMPLETE } from './constants';

export { StatusContext };

interface Props {
  className?: string;
}

function iconName (status: string): IconName {
  switch (status) {
    case 'error':
      return 'ban';

    case 'event':
      return 'assistive-listening-systems';

    case 'received':
      return 'telegram-plane';

    default:
      return 'check';
  }
}

function signerIconName (status: QueueTxStatus): IconName {
  switch (status) {
    case 'cancelled':
      return 'ban';

    case 'completed':
    case 'inblock':
    case 'finalized':
    case 'sent':
      return 'check';

    case 'dropped':
    case 'invalid':
    case 'usurped':
      return 'arrow-down';

    case 'error':
    case 'finalitytimeout':
      return 'exclamation-triangle';

    case 'queued':
    // case 'retracted':
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
            icon='times'
            onClick={removeItem}
          />
          <div className='short'>
            <Icon icon={iconName(status)} />
          </div>
          <div className='desc'>
            <div className='header'>
              {Array.isArray(action)
                ? action.map((action, index) => <div key={index}>{action}</div>)
                : action}
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

function renderItem ({ error, extrinsic, id, removeItem, rpc, status }: QueueTx): React.ReactNode {
  let { method, section } = rpc;

  if (extrinsic) {
    const found = extrinsic.registry.findMetaCall(extrinsic.callIndex);

    if (found.section !== 'unknown') {
      method = found.method;
      section = found.section;
    }
  }

  const icon = signerIconName(status) as 'ban' | 'spinner';

  return (
    <div
      className={classes('item', status)}
      key={id}
    >
      <div className='wrapper'>
        <div className='container'>
          {STATUS_COMPLETE.includes(status) && (
            <Icon
              icon='times'
              onClick={removeItem}
            />
          )}
          <div className='short'>
            {icon === 'spinner'
              ? <Spinner variant='push' />
              : <Icon icon={icon} />
            }
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

function filterSt (stqueue?: QueueStatus[]): QueueStatus[] {
  return (stqueue || []).filter(({ isCompleted }) => !isCompleted);
}

function filterTx (txqueue?: QueueTx[]): [QueueTx[], QueueTx[]] {
  const allTx = (txqueue || []).filter(({ status }) => !['completed', 'incomplete'].includes(status));

  return [allTx, allTx.filter(({ status }) => STATUS_COMPLETE.includes(status))];
}

function Status ({ className = '' }: Props): React.ReactElement<Props> | null {
  const { stqueue, txqueue } = useContext(StatusContext);
  const [allSt, setAllSt] = useState<QueueStatus[]>([]);
  const [[allTx, completedTx], setAllTx] = useState<[QueueTx[], QueueTx[]]>([[], []]);
  const { t } = useTranslation();

  useEffect((): void => {
    setAllSt(filterSt(stqueue));
  }, [stqueue]);

  useEffect((): void => {
    setAllTx(filterTx(txqueue));
  }, [txqueue]);

  const _onDismiss = useCallback(
    (): void => {
      allSt.map((s) => s.removeItem());
      completedTx.map((t) => t.removeItem());
    },
    [allSt, completedTx]
  );

  if (!allSt.length && !allTx.length) {
    return null;
  }

  return (
    <div className={`ui--Status ${className}`}>
      {(allSt.length + completedTx.length) > 1 && (
        <div className='dismiss'>
          <Button
            icon='times'
            isBasic
            isFull
            label={t<string>('Dismiss all notifications')}
            onClick={_onDismiss}
          />
        </div>
      )}
      {allTx.map(renderItem)}
      {allSt.map(renderStatus)}
    </div>
  );
}

export default React.memo(styled(Status)`
  display: inline-block;
  position: fixed;
  right: 0.75rem;
  top: 0.75rem;
  width: 23rem;
  z-index: 1001;

  .dismiss {
    margin-bottom: 0.25rem;

    .ui--Button {
      border: 1px solid white;
    }
  }

  .item {
    display: block;

    > .wrapper > .container {
      align-items: center;
      background: #00688b;
      border-radius: 0.25rem;
      color: white;
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
      padding: 0 0.5rem;
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

        .ui--Icon {
          color: white !important;
          line-height: 1;
        }
      }

      .padded {
        padding: 0.25rem 0 0 0 !important;
      }

      .ui--Icon.isClickable {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
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
    &.usurped {
      & > .wrapper > .container {
        background: red;
      }
    }
  }
`);
