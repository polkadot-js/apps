// Copyright 2017-2021 @polkadot/react-components authors & contributors
// and @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';
import type { QueueStatus, QueueTx, QueueTxStatus } from '@canvas-ui/react-api/Status/types';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import AddressMini from '../AddressMini';
import Button from '../Button';
import Icon from '../Icon';
import Spinner from '../Spinner';
import { ELEV_4_CSS } from '../styles/constants';
import { useTranslation } from '../translate';
import { STATUS_COMPLETE } from '@canvas-ui/react-api/Status/constants';
import StatusContext from '@canvas-ui/react-api/Status/Context';

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
            className='close-button'
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
              className='close-button'
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
            isFull
            isPrimary
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

export default React.memo(styled(Status)(() => `
display: inline-block;
position: fixed;
right: 40px;
top: 30px;
width: 19rem;
z-index: 1001;

&:not(:last-child) {
  margin-bottom: 0.25rem;
}

.dismiss {
  margin-bottom: 0.25rem;
}

.item {
  display: block;

  > .wrapper > .container {
    ${ELEV_4_CSS}
    align-items: center;
    color: var(--white);
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.25rem;
    padding: 0 0.5rem;
    opacity: 0.95;
    vertical-align: middle;
    position: relative;

    .ui--highlight--spinner {
      &:after {
        border-color: #fff transparent transparent !important;
        font-size: 1rem;
      }
    }

    .desc {
      flex: 1;
      overflow: hidden;
      padding: 0.5rem 1rem;

      .header {
        font-family: monospace;
        font-size: 1rem;
      }

      .status {
        color: var(--grey70);
      }

      .ui--AddressMini {
        .ui--AddressMini-address {
          min-width: 0;
          text-align: left;
        }
      }
    }

    .short {
      font-size: 1.125rem;
      color: var(--blue-primary);

      svg {
        line-height: 1;
      }
    }

    .padded {
      padding: 0.25rem 0 0 0 !important;
    }

    .close-button {
      color: var(--grey60);
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
      cursor: pointer;

      &:hover {
        color: var(--grey80);
      }
    }
  }

  // &.queued, &.canceled {
  //   display: none;
  // }

  &.completed,
  &.finalized,
  &.inblock,
  &.sent,
  &.success {
    & > .wrapper > .container .short {
      color: var(--green-primary);
    }
  }

  &.dropped,
  &.error,
  &.finalitytimeout,
  &.invalid,
  &.usurped {
    & > .wrapper > .container .short {
      color: var(--red-primary);
    }
  }
}
`));
