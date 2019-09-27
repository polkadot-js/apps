// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label/Label';

import { classes } from './util';

interface Props extends BareProps {
  label?: React.ReactNode;
}

const defaultLabel: React.ReactNode = (
  <div>&nbsp;</div>
);

export default function InputError ({ className, label = defaultLabel, style }: Props): React.ReactElement<Props> {
  return (
    <div
      className={classes('ui--InputError', className)}
      style={style}
    >
      <Label color='red' pointing='left'>{label}</Label>
    </div>
  );
}
