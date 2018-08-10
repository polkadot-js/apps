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

type Props = BareProps & {
  children?: React.ReactNode,
  isProgress?: boolean,
  label: React.ReactNode,
  progressColor?: ProgressColors,
  progressValue?: BN,
  progressTotal?: BN
};

export default class CardSummary extends React.PureComponent<Props> {
  render () {
    const { children, className, isProgress = false, label, progressColor, progressValue, progressTotal, style } = this.props;

    return (
      <Card
        className={classes('ui--CardSummary', className)}
        style={style}
      >
        <Labelled label={label}>
          <div className='ui--CardSummary-large'>
            {children}{
              isProgress && (
                isUndefined(progressValue) || isUndefined(progressTotal)
                  ? '-'
                  : `${progressValue.toString()}/${progressTotal.toString()}`
              )
            }{
              isProgress && (
                <Progress
                  className='ui--CardSummary-progress'
                  color={progressColor}
                  total={progressTotal}
                  value={progressValue}
                />
              )
            }
          </div>
        </Labelled>
      </Card>
    );
  }
}
