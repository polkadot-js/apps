// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { UInt } from '@polkadot/types';
import { formatNumber, isUndefined } from '@polkadot/util';

import Progress from './Progress';
import Labelled from './Labelled';
import { BlockToTime } from '@polkadot/react-query';

interface ProgressProps {
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
            ? value.muln(100).div(total).toString()
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
              {isTimed && (
                <BlockToTime blocks={progress.total} />
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
                        blocks={progress.total.sub(progress.value)}
                        className='timer'
                      />
                    )
                }
              </div>
            </>
          )
        }
      </Labelled>
      {progress && <Progress {...progress} />}
    </article>
  );
}

export default React.memo(styled(CardSummary)`
  align-items: center;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex: 0 1 auto;
  flex-flow: row wrap;
  justify-content: flex-end;
  padding: 0rem 1.5rem 0.5rem 1.5rem;

  .ui--FormatBalance .balance-postfix {
    opacity: 1;
  }

  .ui--Progress {
    margin: 0.5rem 0.125rem 0.125rem 0.75rem;
  }

  > .ui--Labelled {
    font-size: 1.75rem;
    font-weight: 100;
    position: relative;
    line-height: 1;
    text-align: right;

    > * {
      margin: 0.5rem 0;

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
      font-weight: 100;

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
