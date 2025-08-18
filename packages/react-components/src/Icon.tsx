// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import { styled } from './styled.js';

interface Props {
  className?: string;
  color?: 'gray' | 'green' | 'normal' | 'orange' | 'red' | 'transparent' | 'white' | 'darkGray';
  icon: IconName;
  isPadded?: boolean;
  isSpinning?: boolean;
  onClick?: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  size?: '1x' | '2x';
  tooltip?: string;
}

// one-time init of FA libraries
library.add(fas);

function Icon ({ className = '', color = 'normal', icon, isPadded, isSpinning, onClick, size = '1x', tooltip }: Props): React.ReactElement<Props> {
  const extraProps: Record<string, unknown> = {
    'data-testid': icon,
    ...(tooltip
      ? {
        'data-for': tooltip,
        'data-tip': true
      }
      : {}
    )
  };

  return (
    <StyledFAI
      {...extraProps}
      className={`${className} ui--Icon ${color}Color${onClick ? ' isClickable' : ''}${isPadded ? ' isPadded' : ''}`}
      icon={icon}
      onClick={onClick}
      size={size}
      spin={isSpinning}
      tabIndex={-1}
    />
  );
}

const StyledFAI = styled(FontAwesomeIcon)`
  outline: none;

  &.isClickable {
    cursor: pointer;
  }

  &.isPadded {
    margin: 0 0.25rem;
  }

  &.grayColor {
    opacity: 0.25;
  }

  &.greenColor {
    color: green;
  }

  &.orangeColor {
    color: darkorange;
  }

  &.redColor {
    color: darkred;
  }

  &.transparentColor {
    color: transparent;
  }

  &.whiteColor {
    color: white;
  }

  &.darkGrayColor {
    color: #8B8B8B;
  }
`;

export default React.memo(Icon);
