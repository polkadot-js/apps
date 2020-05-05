// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ButtonProps } from './types';

import React, { useState } from 'react';
import SUIButton from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import styled from 'styled-components';
import { isUndefined } from '@polkadot/util';

import Icon from '../Icon';
import Tooltip from '../Tooltip';

let idCounter = 0;

function Button ({ children, className, floated, icon, isAnimated, isBasic = false, isCircular = false, isDisabled = false, isFluid = false, isIcon, isLoading = false, isNegative = false, isPositive = false, isPrimary = false, label, labelPosition, onClick, onMouseEnter, onMouseLeave, size, style, tabIndex, tooltip }: ButtonProps): React.ReactElement<ButtonProps> {
  const [triggerId] = useState(`button-${++idCounter}`);
  const props = {
    animate: 'fade',
    animated: isAnimated,
    basic: isBasic,
    circular: isCircular,
    className: `${className} ${isIcon && 'isIcon'}`,
    'data-for': triggerId,
    'data-tip': !!tooltip,
    disabled: isDisabled,
    floated,
    fluid: isFluid,
    labelPosition,
    loading: isLoading,
    negative: isNegative,
    onClick,
    onMouseEnter,
    onMouseLeave,
    positive: isPositive,
    primary: isPrimary,
    secondary: !isBasic && !(isPositive || isPrimary || isNegative),
    size: size || (isIcon ? 'tiny' : undefined),
    style,
    tabIndex
  };

  return (
    <>
      {isUndefined(label) && isUndefined(children)
        ? (
          <SUIButton
            {...props}
            icon={icon}
          />
        )
        : (
          <SUIButton {...props}>
            {icon && (
              <><Icon className={icon} />{isIcon ? '' : '  '}</>
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

export default React.memo(styled(Button)`
  &:not(.isIcon) > i.icon {
    margin-left: 0.25rem;
  }

  &.isIcon {
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;

    i.icon {
      margin: 0 0 0 0.25rem !important;
    }
  }
`);
