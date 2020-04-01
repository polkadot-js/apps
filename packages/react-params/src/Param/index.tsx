// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BaseProps, Props as CProps, ComponentMap } from '../types';

import React, { useRef } from 'react';
import { classes } from '@polkadot/react-components/util';
import { displayType } from '@polkadot/types';
import { isUndefined } from '@polkadot/util';

import findComponent from './findComponent';
import Static from './Static';

interface Props extends BaseProps {
  isDisabled?: boolean;
  isOptional?: boolean;
  overrides?: ComponentMap;
}

function Param ({ className, defaultValue, isDisabled, isOptional, name, onChange, onEnter, onEscape, overrides, style, type }: Props): React.ReactElement<Props> | null {
  const compRef = useRef<React.ComponentType<CProps> | null>(findComponent(type, overrides));

  if (!compRef.current) {
    return null;
  }

  const label = isUndefined(name)
    ? displayType(type)
    : `${name}: ${displayType(type)}`;

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
        key={`${name}:${type}`}
        label={label}
        name={name}
        onChange={onChange}
        onEnter={onEnter}
        onEscape={onEscape}
        overrides={overrides}
        style={style}
        type={type}
      />
    );
}

export default React.memo(Param);
