// Copyright 2017-2021 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TypeDef } from '@polkadot/types/types';
import type { Props } from '../types';

import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { Toggle } from '@polkadot/react-components';
import { Option } from '@polkadot/types';

import { useTranslation } from '../translate';
import Param from './index';

function OptionDisplay ({ className = '', defaultValue: _defaultValue, isDisabled, name, onChange, onEnter, onEscape, registry, type: { sub, withOptionActive } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState(withOptionActive || false);

  const defaultValue = useMemo(
    () => isDisabled
      ? _defaultValue && _defaultValue.value instanceof Option && _defaultValue.value.isSome
        ? { isValid: _defaultValue.isValid, value: _defaultValue.value.unwrap() }
        : { isValid: _defaultValue.isValid, value: undefined }
      : _defaultValue,
    [_defaultValue, isDisabled]
  );

  useEffect((): void => {
    !isActive && onChange && onChange({
      isValid: true,
      value: null
    });
  }, [isActive, onChange]);

  return (
    <div className={className}>
      <Param
        defaultValue={defaultValue}
        isDisabled={isDisabled || !isActive}
        isInOption
        isOptional={!isActive && !isDisabled}
        name={name}
        onChange={onChange}
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
