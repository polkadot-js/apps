// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { UInt } from '@polkadot/types';

import React from 'react';
import styled from 'styled-components';

import { BlockToTime } from '@polkadot/react-query';
import { BN_HUNDRED, formatNumber, isUndefined } from '@polkadot/util';

import Labelled from './Labelled';
import Progress from './Progress';

interface ProgressProps {
  hideGraph?: boolean;
  hideValue?: boolean;
  isPercent?: boolean;
  total?: BN | UInt;
  value?: BN | UInt;
  withTime?: boolean;
}

interface Props {
  children?: React.ReactNode;
  className?: string;
  help?: React.ReactNode;
  label: React.ReactNode;
  progress?: ProgressProps;
}

function CardSummary ({ children, className = '', help, label, progress }: Props): React.ReactElement<Props> | null {
  const value = progress && progress.value;
  const total = progress && progress.total;
  const left = progress && !isUndefined(value) && !isUndefined(total) && value.gten(0) && total.gtn(0)
    ? (
      value.gt(total)
        ? `>${
          progress.isPercent
            ? '100'
            : formatNumber(total)
        }`
        : (
          progress.isPercent
            ? value.mul(BN_HUNDRED).div(total).toString()
            : formatNumber(value)
        )
    )
    : undefined;

  if (progress && isUndefined(left)) {
    return null;
  }

  const isTimed = progress && progress.withTime && !isUndefined(progress.total);

  return (
    <article className={className}>
      <Labelled
        help={help}
        isSmall
        label={label}
      >
        {children}{
          progress && !progress.hideValue && (
            <>
              {isTimed && !children && (
                <BlockToTime value={progress.total} />
              )}
              <div className={isTimed ? 'isSecondary' : 'isPrimary'}>
                {!left || isUndefined(progress.total)
                  ? '-'
                  : !isTimed || progress.isPercent || !progress.value
                    ? `${left}${progress.isPercent ? '' : '/'}${
                      progress.isPercent
                        ? '%'
                        : formatNumber(progress.total)
                    }`
                    : (
                      <BlockToTime
                        className='timer'
                        value={progress.total.sub(progress.value)}
                      />
                    )
                }
              </div>
            </>
          )
        }
      </Labelled>
      {progress && !progress.hideGraph && <Progress {...progress} />}
    </article>
  );
}

export default React.memo(styled(CardSummary)`
  align-items: center;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  color: var(--color-summary);
  display: flex;
  flex: 0 1 auto;
  flex-flow: row wrap;
  justify-content: flex-end;
  padding: 0 1.5rem;

  .ui--FormatBalance .balance-postfix {
    opacity: 1;
  }

  .ui--Progress {
    margin: 0.5rem 0.125rem 0.125rem 0.75rem;
  }

  > .ui--Labelled {
    font-size: 1.75rem;
    font-weight: var(--font-weight-light);
    position: relative;
    line-height: 1;
    text-align: right;

    > * {
      margin: 0.25rem 0;

      &:first-child {
        margin-top: 0;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }

    > label {
      font-size: 0.95rem;
    }

    .isSecondary {
      font-size: 1rem;
      font-weight: var(--font-weight-normal);

      .timer {
        min-width: 8rem;
      }
    }
  }

  @media(max-width: 767px) {
    min-height: 4.8rem;
    padding: 0.25 0.4em;

    > div {
      font-size: 1.4rem;
    }
  }
`);
