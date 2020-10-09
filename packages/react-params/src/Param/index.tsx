// Copyright 2017-2020 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Props, Props as CProps } from '../types';

import React, { useRef } from 'react';
import { classes } from '@polkadot/react-components/util';
import { encodeTypeDef } from '@polkadot/types';
import { isUndefined } from '@polkadot/util';

import findComponent from './findComponent';
import Static from './Static';

function Param ({ className = '', defaultValue, isDisabled, isInOption, isOptional, name, onChange, onEnter, onEscape, overrides, type }: Props): React.ReactElement<Props> | null {
  const compRef = useRef<React.ComponentType<CProps> | null>(findComponent(type, overrides));

  if (!compRef.current) {
    return null;
  }

  const label = isUndefined(name)
    ? encodeTypeDef(type)
    : `${name}: ${encodeTypeDef(type)}`;

  return isOptional
    ? (
      <Static
        defaultValue={defaultValue}
        label={label}
        type={type}
      />
    )
    : (
      <compRef.current
        className={classes('ui--Param', className)}
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isInOption={isInOption}
        key={`${name || 'unknown'}:${type.toString()}`}
        label={label}
        name={name}
        onChange={onChange}
        onEnter={onEnter}
        onEscape={onEscape}
        overrides={overrides}
        type={type}
      />
    );
}

export default React.memo(Param);
