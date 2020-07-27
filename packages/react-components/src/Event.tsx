// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Event } from '@polkadot/types/interfaces';
import { Codec, TypeDef } from '@polkadot/types/types';
import { BareProps } from './types';

import React from 'react';
import { getTypeDef } from '@polkadot/types';
import Params from '@canvas-ui/react-params';

import { classes } from '@canvas-ui/react-util';

export interface Props extends BareProps {
  children?: React.ReactNode;
  value: Event;
}

function EventDisplay ({ children, className = '', value }: Props): React.ReactElement<Props> {
  const params = value.typeDef.map(({ type }): { type: TypeDef } => ({
    type: getTypeDef(type)
  }));
  const values = value.data.map((value): { isValid: boolean; value: Codec } => ({
    isValid: true,
    value
  }));

  return (
    <div className={classes('ui--Event', className)}>
      {children}
      <Params
        isDisabled
        params={params}
        values={values}
      />
    </div>
  );
}

export default React.memo(EventDisplay);
