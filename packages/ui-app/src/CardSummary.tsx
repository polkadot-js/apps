// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from './types';

import BN from 'bn.js';
import React from 'react';
import { UInt } from '@polkadot/types/codec';
import isUndefined from '@polkadot/util/is/undefined';

import Progress, { Colors as ProgressColors } from './Progress';
import Labelled from './Labelled';
import classes from './util/classes';

type ProgressProps = {
  color?: ProgressColors,
  isPercent?: boolean,
  total?: BN | UInt,
  value?: BN | UInt
};

type Props = BareProps & {
  children?: React.ReactNode,
  label: React.ReactNode,
  progress?: ProgressProps
};

export default class CardSummary extends React.PureComponent<Props> {
  render () {
    const { children, className, progress, label, style } = this.props;
    const value = progress && progress.value instanceof UInt
      ? progress.value.toBn()
      : progress && progress.value as BN;
    const total = progress && progress.total instanceof UInt
      ? progress.total.toBn()
      : progress && progress.total as BN;
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

    return (
      <article
        className={classes('ui--CardSummary', className)}
        style={style}
      >
        <Labelled label={label}>
          <div className='ui--CardSummary-large'>
            {children}{
              progress && (
                !left || isUndefined(progress.total)
                  ? '-'
                  : `${left}${progress.isPercent ? '' : '/'}${
                    progress.isPercent
                      ? '%'
                      : progress.total.toString()
                  }`
              )
            }
          </div>
          {
            progress && (
              <Progress
                className='ui--CardSummary-progress'
                {...progress}
              />
            )
          }
        </Labelled>
      </article>
    );
  }
}
