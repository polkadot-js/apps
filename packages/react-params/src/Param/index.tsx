// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { BaseProps, Props as CProps, ComponentMap } from '../types';

import React, { useRef } from 'react';
import { classes } from '@polkadot/react-components/util';
import { isUndefined } from '@polkadot/util';

import translate from '../translate';
import findComponent from './findComponent';
import Static from './Static';

interface Props extends I18nProps, BaseProps {
  isDisabled?: boolean;
  isOptional?: boolean;
  overrides?: ComponentMap;
}

function Param ({ className, defaultValue, isDisabled, isOptional, name, onChange, onEnter, overrides, style, type }: Props): React.ReactElement<Props> | null {
  const compRef = useRef<React.ComponentType<CProps> | null>(findComponent(type, overrides));

  if (!compRef.current) {
    return null;
  }

  const label = isUndefined(name)
    ? (type.displayName || type.type)
    : `${name}: ${type.displayName || type.type}`;

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
        key={`${name}:${type}`}
        isDisabled={isDisabled}
        label={label}
        name={name}
        onChange={onChange}
        onEnter={onEnter}
        style={style}
        type={type}
      />
    );
}

export default translate(Param);
