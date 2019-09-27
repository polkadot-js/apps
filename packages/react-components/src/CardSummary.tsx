// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { UInt } from '@polkadot/types';
import { formatNumber, isUndefined } from '@polkadot/util';

import Progress, { Colors as ProgressColors } from './Progress';
import Labelled from './Labelled';

interface ProgressProps {
  color?: ProgressColors;
  hideValue?: boolean;
  isPercent?: boolean;
  total?: BN | UInt;
  value?: BN | UInt;
}

interface Props extends BareProps {
  children?: React.ReactNode;
  help?: React.ReactNode;
  label: React.ReactNode;
  progress?: ProgressProps;
}

function CardSummary ({ children, className, help, label, progress }: Props): React.ReactElement<Props> | null {
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

  return (
    <article className={className}>
      <Labelled
        help={help}
        isSmall
        label={label}
      >
        {children}{
          progress && !progress.hideValue && (
            !left || isUndefined(progress.total)
              ? '-'
              : `${left}${progress.isPercent ? '' : '/'}${
                progress.isPercent
                  ? '%'
                  : formatNumber(progress.total)
              }`
          )
        }
        {progress && <Progress {...progress} />}
      </Labelled>
    </article>
  );
}

export default styled(CardSummary)`
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

  > div {
    font-size: 2.1rem;
    font-weight: 100;
    position: relative;
    line-height: 2.1rem;
    text-align: right;

    > * {
      margin: 0.6rem 0;

      &:first-child {
        margin-top: 0;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }

    > label {
      line-height: 1rem;
      font-size: 0.95rem;
      min-height: 1rem;
    }

    .progress {
      margin: 0.2rem 0 -0.5rem !important;
      background: rgba(0,0,0,0.05);
    }
  }

  @media(max-width: 767px) {
    min-height: 4.8rem;
    padding: 0.25 0.4em;

    > div {
      font-size: 1.4rem;
      line-height: 1.4rem;
    }
  }
`;
