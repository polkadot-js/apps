// Copyright 2017-2021 @polkadot/react-params authors & contributors
// and @canvas-ui/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Toggle } from '@canvas-ui/react-components';
import { Props } from '@canvas-ui/react-components/types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { TypeDef } from '@polkadot/types/types';

import { useTranslation } from '@canvas-ui/react-components/Params/translate';
import Param from './Param';

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
        isOptional={!isActive && !isDisabled}
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
