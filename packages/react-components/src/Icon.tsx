// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName, library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  color?: 'gray' | 'green' | 'normal' | 'orange' | 'red' | 'transparent';
  icon: IconName;
  isSpinning?: boolean;
  onClick?: () => void;
  size?: '1x' | '2x';
  tooltip?: string;
}

// one-time init of FA libraries
library.add(fas);

function Icon ({ className = '', color = 'normal', icon, isSpinning, onClick, size = '1x', tooltip }: Props): React.ReactElement<Props> {
  const extraProps = tooltip
    ? { 'data-for': tooltip, 'data-tip': true }
    : {};

  return (
    <FontAwesomeIcon
      {...extraProps}
      className={`ui--Icon ${color}Color${onClick ? ' isClickable' : ''} ${className}`}
      icon={icon}
      onClick={onClick}
      size={size}
      spin={isSpinning}
    />
  );
}

export default React.memo(styled(Icon)`
  &.isClickable {
    cursor: pointer;
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
`);
