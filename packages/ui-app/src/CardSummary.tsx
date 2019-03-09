// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import BN from 'bn.js';
import React from 'react';
import { UInt } from '@polkadot/types';
import { isUndefined } from '@polkadot/util';

import { classes } from './util';
import Progress, { Colors as ProgressColors } from './Progress';
import Labelled from './Labelled';

type ProgressProps = {
  color?: ProgressColors,
  hideValue?: boolean,
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
      <article
        className={classes('ui--CardSummary', className)}
        style={style}
      >
        <Labelled
          isSmall
          label={label}
        >
          <div className='ui--CardSummary-large'>
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
