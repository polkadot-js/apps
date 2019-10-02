// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef } from '@polkadot/types/types';
import { I18nProps } from '@polkadot/react-components/types';
import { Props as CProps } from '../types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Toggle } from '@polkadot/react-components';

import translate from '../translate';
import Param from './index';

interface Props extends CProps, I18nProps {}

function Option ({ className, defaultValue, isDisabled, name, onChange, onEnter, t, type: { sub } }: Props): React.ReactElement<Props> {
  const [isActive, setIsActive] = useState(true);

  useEffect((): void => {
    !isActive && onChange && onChange({
      isValid: true,
      value: null
    });
  }, [isActive]);

  return (
    <div className={className}>
      <Param
        defaultValue={defaultValue}
        isDisabled={isDisabled || !isActive}
        isOptional={!isActive}
        name={name}
        onChange={onChange}
        onEnter={onEnter}
        type={sub as TypeDef}
      />
      {!isDisabled && (
        <Toggle
          className='ui--Param-Option-toggle'
          label={
            isActive
              ? t('include option')
              : t('exclude option')
          }
          onChange={setIsActive}
          value={isActive}
        />
      )}
    </div>
  );
}

export default translate(
  styled(Option)`
    position: relative;

    .ui--Param-Option-toggle {
      position: absolute;
      right: 3.5rem;
      top: 0.5rem;
    }
  `
);
