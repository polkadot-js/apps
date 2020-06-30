// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label/Label';

import { classes } from './util';

interface Props {
  className?: string;
  label?: React.ReactNode;
}

const defaultLabel: React.ReactNode = (
  <div>&nbsp;</div>
);

function InputError ({ className = '', label = defaultLabel }: Props): React.ReactElement<Props> {
  return (
    <div className={classes('ui--InputError', className)}>
      <Label
        color='red'
        pointing='left'
      >
        {label}
      </Label>
    </div>
  );
}

export default React.memo(InputError);
