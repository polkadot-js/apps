// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BaseProps, Props as CProps, ComponentMap } from '../types';

import React, { useRef } from 'react';
import { classes } from '@canvas-ui/react-util';
import { displayType } from '@polkadot/types';
import { isUndefined } from '@polkadot/util';

import findComponent from './findComponent';
import Static from './Static';

interface Props extends BaseProps {
  isDisabled?: boolean;
  isOptional?: boolean;
  overrides?: ComponentMap;
}

function Param ({ className = '', defaultValue, isDisabled, isOptional, name, onChange, onEnter, onEscape, overrides, type }: Props): React.ReactElement<Props> | null {
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
