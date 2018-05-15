// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from './types';

import React from 'react';
import Label from 'semantic-ui-react/dist/es/elements/Label';

import classes from './util/classes';

type Props = BareProps & {
  isHidden?: boolean,
  // flowlint-next-line unclear-type:off
  label?: any,
  children: React$Node,
  withLabel?: boolean,
};

const defaultLabel: React$Node = (
  <div>&nbsp;</div>
);

export default function Labelled ({ className, children, isHidden = false, label = defaultLabel, style, withLabel = true }: Props): React$Node {
  if (isHidden) {
    return false;
  }

  return (
    <div
      className={classes('ui--Labelled', className)}
      style={style}
    >
      {
        withLabel
          ? <Label>{label}</Label>
          : null
      }
      {children}
    </div>
  );
}
