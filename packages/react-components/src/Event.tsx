// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Event } from '@polkadot/types/interfaces';
import { Codec, TypeDef } from '@polkadot/types/types';
import { BareProps } from './types';

import React from 'react';
import { getTypeDef } from '@polkadot/types';
import Params from '@polkadot/react-params';

import { classes } from './util';

export interface Props extends BareProps {
  children?: React.ReactNode;
  value: Event;
}

export default function EventDisplay ({ children, className, style, value }: Props): React.ReactElement<Props> {
  const params = value.typeDef.map(({ type }): { type: TypeDef } => ({
    type: getTypeDef(type)
  }));
  const values = value.data.map((value): { isValid: boolean; value: Codec } => ({
    isValid: true,
    value
  }));

  return (
    <div
      className={classes('ui--Event', className)}
      style={style}
    >
      {children}
      <Params
        isDisabled
        params={params}
        values={values}
      />
    </div>
  );
}
