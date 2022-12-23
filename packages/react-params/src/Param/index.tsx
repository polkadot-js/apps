// Copyright 2017-2022 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props } from '../types';

import React, { useMemo } from 'react';

import { getTypeDef } from '@polkadot/types';
import { encodeTypeDef } from '@polkadot/types/create';
import { isUndefined } from '@polkadot/util';

import findComponent from './findComponent';
import Static from './Static';

function formatJSON (input: string): string {
  return input
    .replace(/"/g, '')
    .replace(/\\/g, '')
    .replace(/:Null/g, '')
    .replace(/:/g, ': ')
    // .replace(/{/g, '{ ')
    // .replace(/}/g, ' }')
    .replace(/,/g, ', ');
}

function Param ({ className = '', defaultValue, isDisabled, isError, isInOption, isOptional, name, onChange, onEnter, onEscape, overrides, registry, type }: Props): React.ReactElement<Props> | null {
  const Component = useMemo(
    () => findComponent(registry, type, overrides),
    [registry, type, overrides]
  );

  const label = useMemo(
    (): string => {
      const inner = encodeTypeDef(
        registry,
        // if our type is a Lookup, try and unwrap again
        registry.isLookupType(type.lookupName || type.type)
          ? getTypeDef(registry.createType(type.type).toRawType())
          : type
      );
      const fmtType = formatJSON(`${isDisabled && isInOption ? 'Option<' : ''}${inner}${isDisabled && isInOption ? '>' : ''}`);

      return `${isUndefined(name) ? '' : `${name}: `}${fmtType}${type.typeName && !fmtType.includes(type.typeName) ? ` (${type.typeName})` : ''}`;
    },
    [isDisabled, isInOption, name, registry, type]
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
        isError={isError}
        isInOption={isInOption}
        key={`${name || 'unknown'}:${label}`}
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
