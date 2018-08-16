// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from './types';

import BN from 'bn.js';
import React from 'react';
import isUndefined from '@polkadot/util/is/undefined';

import Card from './Card';
import Progress, { Colors as ProgressColors } from './Progress';
import Labelled from './Labelled';
import classes from './util/classes';

type ProgressProps = {
  color?: ProgressColors,
  total?: BN,
  value?: BN
};

type Props = BareProps & {
  children?: React.ReactNode,
  label: React.ReactNode,
  progress?: ProgressProps
};

export default class CardSummary extends React.PureComponent<Props> {
  render () {
    const { children, className, progress, label, style } = this.props;
    const left = progress && !isUndefined(progress.value) && !isUndefined(progress.total) && progress.value.gten(0) && progress.total.gtn(0)
      ? (
        progress.value.gt(progress.total)
          ? `>${progress.total.toString()}`
          : progress.value.toString()
      )
      : undefined;

    return (
      <Card
        className={classes('ui--CardSummary', className)}
        style={style}
      >
        <Labelled label={label}>
          <div className='ui--CardSummary-large'>
            {children}{
              progress && (
                !left || isUndefined(progress.total)
                  ? '-'
                  : `${left}/${progress.total.toString()}`
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
      </Card>
    );
  }
}
