// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Event } from '@polkadot/types/interfaces';
import { Codec, TypeDef } from '@polkadot/types/types';

import React from 'react';
import { getTypeDef } from '@polkadot/types';
import Params from '@polkadot/react-params';

import { classes } from './util';

export interface Props {
  children?: React.ReactNode;
  className?: string;
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
