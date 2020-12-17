// Copyright 2017-2020 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props } from '../types';

import React, { useMemo } from 'react';

import { encodeTypeDef } from '@polkadot/types/create';
import { isUndefined } from '@polkadot/util';

import findComponent from './findComponent';
import Static from './Static';

function Param ({ className = '', defaultValue, isDisabled, isInOption, isOptional, name, onChange, onEnter, onEscape, overrides, registry, type }: Props): React.ReactElement<Props> | null {
  const Component = useMemo(
    () => findComponent(registry, type, overrides),
    [registry, type, overrides]
  );

  const label = useMemo(
    () => isUndefined(name)
      ? encodeTypeDef(type)
      : `${name}: ${encodeTypeDef(type)}`,
    [name, type]
  );

  if (!Component) {
    return null;
  }

  return isOptional
    ? (
      <Static
        defaultValue={defaultValue}
        label={label}
        type={type}
      />
    )
    : (
      <Component
        className={`ui--Param ${className}`}
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
        registry={registry}
        type={type}
      />
    );
}

export default React.memo(Param);
