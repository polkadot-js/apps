// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ButtonProps } from './types';

import React, { useState } from 'react';
import SUIButton from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import styled from 'styled-components';

import Icon from '../Icon';
import Tooltip from '../Tooltip';

let idCounter = 0;

function Button ({ children, className = '', floated, icon, isAnimated, isBasic = false, isCircular = false, isDisabled = false, isFluid = false, isIcon, isLoading = false, isNegative = false, isPositive = false, isPrimary = false, label, labelPosition, onClick, onMouseEnter, onMouseLeave, size, tabIndex, tooltip }: ButtonProps): React.ReactElement<ButtonProps> {
  const [triggerId] = useState(`button-${++idCounter}`);
  const props = {
    animate: 'fade',
    animated: isAnimated,
    basic: isBasic,
    circular: isCircular,
    className: `${className} ${isCircular ? 'isCircular' : ''} ${isIcon ? 'isIcon' : ''} ${(isCircular || isIcon || !(children || label)) ? 'icon' : ''}`,
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
    size: size || (isCircular ? undefined : (isIcon ? 'tiny' : 'small')),
    tabIndex
  };

  return (
    <>
      <SUIButton {...props}>
        {icon && (
          <><Icon icon={icon} />{(isIcon || isCircular) ? '' : '  '}</>
        )}
        {label}
        {children}
      </SUIButton>
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
  &:not(.icon) {
    > .ui--Icon {
      margin-right: 0.25rem;
    }
  }

  &.icon > .ui--Icon {
    width: 1rem;
  }

  &.isIcon {
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;

    .ui--Icon {
      margin: 0 0 0 0.25rem !important;
    }
  }
`);
