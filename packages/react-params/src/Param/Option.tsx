// Copyright 2017-2020 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TypeDef } from '@polkadot/types/types';
import { Props } from '../types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Toggle } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Param from './index';

function Option ({ className = '', defaultValue, isDisabled, name, onChange, onEnter, onEscape, type: { sub, withOptionActive } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState(withOptionActive || false);

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
        isOptional={!isActive}
        name={name}
        onChange={onChange}
        onEnter={onEnter}
        onEscape={onEscape}
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

export default React.memo(styled(Option)`
  position: relative;
`);
