// Copyright 2017-2021 @polkadot/react-params authors & contributors
// and @canvas-ui/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Props as CProps, Props } from '@canvas-ui/react-components/types';
import { classes } from '@canvas-ui/react-util';
import React, { useMemo, useRef } from 'react';

import { encodeTypeDef } from '@polkadot/types';
import { isUndefined } from '@polkadot/util';

import findComponent from './findComponent';
import Static from './Static';

function Param ({ className = '', defaultValue, isDisabled, isInOption, isOptional, name, onChange, onEnter, onEscape, overrides, type }: Props): React.ReactElement<Props> | null {
  const compRef = useRef<React.ComponentType<CProps> | null>(findComponent(type, overrides));

  const label = useMemo(
    () => isUndefined(name)
      ? encodeTypeDef(type)
      : `${name}: ${encodeTypeDef(type)}`,
    [name, type]
  );

  if (!compRef.current) {
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
