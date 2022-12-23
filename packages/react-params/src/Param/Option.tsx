// Copyright 2017-2022 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Codec, TypeDef } from '@polkadot/types/types';
import type { Props, RawParamOnChangeValue } from '../types';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Toggle } from '@polkadot/react-components';
import { Option } from '@polkadot/types';
import { isU8a, u8aConcat } from '@polkadot/util';

import { useTranslation } from '../translate';
import Param from './index';

const DEF_VALUE = { isValid: true, value: undefined };
const OPT_PREFIX = new Uint8Array([1]);

function OptionDisplay ({ className = '', defaultValue: _defaultValue, isDisabled, name, onChange, onEnter, onEscape, registry, type: { sub, withOptionActive } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState(() => withOptionActive || !!(_defaultValue && _defaultValue.value instanceof Option && _defaultValue.value.isSome) || false);
  const [defaultValue] = useState(
    () => isActive || isDisabled
      ? _defaultValue && (
        _defaultValue.value instanceof Option && _defaultValue.value.isSome
          ? { isValid: _defaultValue.isValid, value: (_defaultValue.value as Option<Codec>).unwrap() }
          : DEF_VALUE
      )
      : DEF_VALUE
  );

  useEffect((): void => {
    !isActive && onChange && onChange({
      isValid: true,
      value: null
    });
  }, [isActive, onChange]);

  const _onChange = useCallback(
    (value: RawParamOnChangeValue) =>
      onChange && onChange(
        value.isValid && isU8a(value.value) && !withOptionActive && isActive
          ? { isValid: true, value: u8aConcat(OPT_PREFIX, value.value) }
          : value
      ),
    [isActive, onChange, withOptionActive]
  );

  return (
    <div className={className}>
      <Param
        defaultValue={
          isActive
            ? defaultValue
            : DEF_VALUE}
        isDisabled={isDisabled || !isActive}
        isInOption
        isOptional={!isActive && !isDisabled}
        name={name}
        onChange={_onChange}
        onEnter={onEnter}
        onEscape={onEscape}
        registry={registry}
        type={sub as TypeDef}
      />
      {!isDisabled && (
        <Toggle
          isOverlay
          label={t<string>('include option')}
          onChange={setIsActive}
          value={isActive}
        />
      )}
    </div>
  );
}

export default React.memo(styled(OptionDisplay)`
  position: relative;
`);
