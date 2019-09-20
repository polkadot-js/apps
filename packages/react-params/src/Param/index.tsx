// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { BaseProps, Props as CProps, ComponentMap } from '../types';

import React, { useRef } from 'react';
import { classes } from '@polkadot/react-components/util';
import translate from '@polkadot/react-components/translate';
import { isUndefined } from '@polkadot/util';

import findComponent from './findComponent';

interface Props extends I18nProps, BaseProps {
  isDisabled?: boolean;
  overrides?: ComponentMap;
}

function Param ({ className, defaultValue, isDisabled, isOptional, name, onChange, onEnter, overrides, style, type }: Props): React.ReactElement<Props> | null {
  const compRef = useRef<React.ComponentType<CProps> | null>(findComponent(type, overrides));

  if (!compRef.current) {
    return null;
  }

  return (
    <compRef.current
      className={classes('ui--Param', className)}
      defaultValue={defaultValue}
      key={`${name}:${type}`}
      isDisabled={isDisabled}
      isOptional={isOptional}
      label={
        isUndefined(name)
          ? type.type
          : `${name}: ${type.type}`
      }
      name={name}
      onChange={onChange}
      onEnter={onEnter}
      style={style}
      type={type}
    />
  );
}

export default translate(Param);
