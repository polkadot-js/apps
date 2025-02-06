// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props } from '../types.js';

import React, { useMemo } from 'react';

import { getTypeDef } from '@polkadot/types';
import { encodeTypeDef } from '@polkadot/types/create';
import { isUndefined } from '@polkadot/util';

import findComponent from './findComponent.js';
import Static from './Static.js';

function formatJSON (input: string): string {
  return input
    .replace(/"/g, '')
    .replace(/\\/g, '')
    .replace(/:Null/g, '')
    .replace(/:/g, ': ')
    .replace(/,/g, ', ')
    .replace(/^{_alias: {.*}, /, '{');
}

function Param ({ className = '', defaultValue, isDisabled, isError, isOptional, name, onChange, onEnter, onEscape, overrides, registry, type, withLength = true }: Props): React.ReactElement<Props> | null {
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
      const fmtType = formatJSON(inner);

      return `${isUndefined(name) ? '' : `${name}: `}${fmtType}${type.typeName && !fmtType.includes(type.typeName) ? ` (${type.typeName})` : ''}`;
    },
    [name, registry, type]
  );

  if (!Component) {
    return null;
  }

  return isOptional
    ? (
      <Static
        defaultValue={defaultValue}
        isOptional
        label='None'
      />
    )
    : (
      <Component
        className={`${className} ui--Param`}
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        key={`${name || 'unknown'}:${label}`}
        label={label}
        name={name}
        onChange={onChange}
        onEnter={onEnter}
        onEscape={onEscape}
        overrides={overrides}
        registry={registry}
        type={type}
        withLength={withLength}
      />
    );
}

export default React.memo(Param);
