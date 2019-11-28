// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ButtonProps } from './types';

import React, { useState } from 'react';
import SUIButton from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import { isUndefined } from '@polkadot/util';

import Icon from '../Icon';
import Tooltip from '../Tooltip';

let idCounter = 0;

export default function Button ({ children, className, floated, icon, isBasic = false, isCircular = false, isDisabled = false, isFluid = false, isLoading = false, isNegative = false, isPositive = false, isPrimary = false, label, labelPosition, onClick, size, style, tabIndex, tooltip }: ButtonProps): React.ReactElement<ButtonProps> {
  const [triggerId] = useState(`button-${++idCounter}`);
  const props = {
    basic: isBasic,
    circular: isCircular,
    className,
    'data-tip': !!tooltip,
    'data-for': triggerId,
    disabled: isDisabled,
    floated,
    fluid: isFluid,
    labelPosition,
    loading: isLoading,
    negative: isNegative,
    onClick,
    positive: isPositive,
    primary: isPrimary,
    size,
    secondary: !isBasic && !(isPositive || isPrimary || isNegative),
    style,
    tabIndex
  };

  return (
    <>
      {isUndefined(label) && isUndefined(children)
        ? <SUIButton {...props} icon={icon} />
        : (
          <SUIButton {...props}>
            {icon && (
              <><Icon className={icon} />{'  '}</>
            )}
            {label}
            {children}
          </SUIButton>
        )
      }
      {tooltip && (
        <Tooltip
          place='top'
          text={tooltip}
          trigger={triggerId}
        />
      )}
    </>
  );
}
