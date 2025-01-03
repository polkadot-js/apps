// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { UInt } from '@polkadot/types';
import type { BN } from '@polkadot/util';

import React from 'react';

import { BlockToTime } from '@polkadot/react-query';
import { BN_HUNDRED, formatNumber, isUndefined } from '@polkadot/util';

import Labelled from './Labelled.js';
import Progress from './Progress.js';
import { styled } from './styled.js';

interface ProgressProps {
  hideGraph?: boolean;
  hideValue?: boolean;
  isBlurred?: boolean;
  isPercent?: boolean;
  total?: BN | UInt;
  value?: BN | UInt;
  withTime?: boolean;
}

interface Props {
  children?: React.ReactNode;
  className?: string;
  label: React.ReactNode;
  progress?: ProgressProps;
}

function CardSummary ({ children, className = '', label, progress }: Props): React.ReactElement<Props> | null {
  const value = progress?.value;
  const total = progress?.total;
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

  // We don't care about the label as much...
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const testidSuffix = (label ?? '').toString();

  return (
    <StyledArticle
      className={className}
      data-testid={`card-summary:${testidSuffix}`}
    >
      <Labelled
        isSmall
        label={label}
      >
        {children}{
          progress && !progress.hideValue && (
            <>
              {isTimed && !children && (
                <BlockToTime
                  className={progress.isBlurred ? '--tmp' : ''}
                  value={progress.total}
                />
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
                        className={`${progress.isBlurred ? '--tmp' : ''} timer`}
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
    </StyledArticle>
  );
}

const StyledArticle = styled.article`
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
    font-size: var(--font-size-h1);
    font-weight: var(--font-weight-header);
    position: relative;
    line-height: 1;
    text-align: right;

    > .ui--Labelled-content {
      color: var(--color-header);
    }

    > * {
      margin: 0.25rem 0;

      &:first-child {
        margin-top: 0;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }

    .isSecondary {
      font-size: var(--font-size-base);
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
`;

export default React.memo(CardSummary);
