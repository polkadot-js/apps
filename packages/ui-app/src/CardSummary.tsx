// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import BN from 'bn.js';
import React from 'react';
import { UInt } from '@polkadot/types';
import { isUndefined } from '@polkadot/util';

import Progress, { Colors as ProgressColors } from './Progress';
import Labelled from './Labelled';

import styled from 'styled-components';

const Card = styled.article`
  align-items: center;
  box-shadow: none;
  color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex: 0 1 auto;
  flex-flow: row wrap;
  justify-content: flex-end;
  min-height: 5.7rem;
  padding: 0.5rem 1.5rem;

  > div {
    font-size: 2.1rem;
    font-weight: 100;
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

type ProgressProps = {
  color?: ProgressColors,
  hideValue?: boolean,
  isPercent?: boolean,
  total?: BN | UInt,
  value?: BN | UInt
};

type Props = BareProps & {
  children?: React.ReactNode,
  help?: React.ReactNode,
  label: React.ReactNode,
  progress?: ProgressProps
};

export default class CardSummary extends React.PureComponent<Props> {
  render () {
    const { children, className, help, label, progress, style } = this.props;
    const value = progress && progress.value;
    const total = progress && progress.total;
    const left = progress && !isUndefined(value) && !isUndefined(total) && value.gten(0) && total.gtn(0)
      ? (
        value.gt(total)
          ? `>${
            progress.isPercent
              ? '100'
              : total.toString()
            }`
          : (
            progress.isPercent
              ? value.muln(100).div(total).toString()
              : value.toString()
          )
      )
      : undefined;

    if (progress && isUndefined(left)) {
      return null;
    }

    return (
      <Card
        className={className}
        style={style}
      >
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
                    : progress.total.toString()
                }`
            )
          }
          { progress && <Progress {...progress} /> }
        </Labelled>
      </Card>
    );
  }
}
