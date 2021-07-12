// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  color?: 'gray' | 'green' | 'normal' | 'orange' | 'red' | 'transparent' | 'white';
  icon: IconName;
  isPadded?: boolean;
  isSpinning?: boolean;
  onClick?: () => void;
  size?: '1x' | '2x';
  tooltip?: string;
}

// one-time init of FA libraries
library.add(fas);

function Icon ({ className = '', color = 'normal', icon, isPadded, isSpinning, onClick, size = '1x', tooltip }: Props): React.ReactElement<Props> {
  const extraProps = tooltip
    ? { 'data-for': tooltip, 'data-testid': icon, 'data-tip': true }
    : {};

  return (
    <FontAwesomeIcon
      {...extraProps}
      className={`ui--Icon ${color}Color${onClick ? ' isClickable' : ''}${isPadded ? ' isPadded' : ''} ${className}`}
      icon={icon}
      onClick={onClick}
      size={size}
      spin={isSpinning}
      tabIndex={-1}
    />
  );
}

export default React.memo(styled(Icon)`
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
`);
