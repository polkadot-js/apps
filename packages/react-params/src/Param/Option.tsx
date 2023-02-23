// Copyright 2017-2023 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Codec, TypeDef } from '@polkadot/types/types';
import type { Props, RawParamOnChangeValue } from '../types';

import React, { useCallback, useEffect, useState } from 'react';

import { Toggle } from '@polkadot/react-components';
import { Option } from '@polkadot/types';
import { isU8a, u8aConcat } from '@polkadot/util';

import Holder from '../Holder';
import { useTranslation } from '../translate';
import Base from './Base';
import Param from './index';
import Static from './Static';

const DEF_VALUE = { isValid: true, value: undefined };
const OPT_PREFIX = new Uint8Array([1]);

function OptionDisplay ({ className = '', defaultValue: _defaultValue, isDisabled, label, onChange, onEnter, onEscape, registry, type: { sub, withOptionActive }, withLabel }: Props): React.ReactElement<Props> {
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
    <div className={`${className} --relative`}>
      <Base
        className='--relative'
        label={label}
        labelExtra={!isDisabled && (
          <Toggle
            label={t<string>('include option')}
            onChange={setIsActive}
            value={isActive}
          />
        )}
        withLabel={withLabel}
      />
      <Holder>
        <div className='ui--Params-Content'>
          {isActive
            ? (
              <Param
                defaultValue={defaultValue}
                isDisabled={isDisabled || !isActive}
                isOptional={!isActive && !isDisabled}
                onChange={_onChange}
                onEnter={onEnter}
                onEscape={onEscape}
                registry={registry}
                type={sub as TypeDef}
              />
            )
            : (
              <Static
                defaultValue={DEF_VALUE}
                isOptional
                label='None'
              />
            )
          }
        </div>
      </Holder>
    </div>
  );
}

export default React.memo(OptionDisplay);
