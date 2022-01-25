// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';
import type { QueueStatus, QueueTx, QueueTxStatus } from './types';

import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import AddressMini from '../AddressMini';
import Icon from '../Icon';
import Spinner from '../Spinner';
import { STATUS_COMPLETE } from './constants';
import StatusContext from './Context';

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
      className={`item ${status}`}
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
      className={`item ${status}`}
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
              {error ? (error.message || error) : status}
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

function filterTx (txqueue?: QueueTx[]): QueueTx[] {
  return (txqueue || []).filter(({ status }) => !['completed', 'incomplete'].includes(status));
}

function Status ({ className = '' }: Props): React.ReactElement<Props> | null {
  const { stqueue, txqueue } = useContext(StatusContext);
  const [allSt, setAllSt] = useState<QueueStatus[]>([]);
  const [allTx, setAllTx] = useState<QueueTx[]>([]);

  useEffect((): void => {
    setAllSt(filterSt(stqueue));
  }, [stqueue]);

  useEffect((): void => {
    setAllTx(filterTx(txqueue));
  }, [txqueue]);

  if (!allSt.length && !allTx.length) {
    return null;
  }

  return (
    <div className={`ui--Status ${className}`}>
      {allTx.map(renderItem)}
      {allSt.map(renderStatus)}
    </div>
  );
}

export default React.memo(styled(Status)`
  /* bottom: 0; */
  display: inline-block;
  overflow: hidden;
  position: fixed;
  right: 0.75rem;
  top: 0.75rem;
  transition-property: width;
  transition-duration: 0.75s;
  width: 4.5rem;
  z-index: 1001;

  :hover {
    transform: scale(1);
    width: 23rem;

    .item .desc {
      display: block;
    }
  }

  .item {
    display: block;

    .desc {
      display: none;
    }

    > .wrapper > .container {
      align-items: top;
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
        padding: 0.75rem 1rem 0.5rem;
        width: 19rem;

        .status {
          font-weight: var(--font-weight-normal);
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
        min-width: 3rem;
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
