// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName, library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  color?: 'green' | 'red' | 'normal';
  icon: IconName;
  onClick?: () => void;
  onMouseOut?: () => void;
  onMouseOver?: () => void;
  size?: 'large';
}

// one-time init of FA libraries
library.add(fab, fas);

function Icon ({ className = '', color = 'normal', icon, onClick, onMouseOut, onMouseOver, size }: Props): React.ReactElement<Props> {
  return (
    <FontAwesomeIcon
      className={`ui--Icon ${color}Color ${className}`}
      icon={icon}
      onClick={onClick}
      onMouseOut={onMouseOut}
      onMouseOver={onMouseOver}
      size={size === 'large' ? '2x' : '1x'}
    />
  );
}

export default React.memo(styled(Icon)`
  &.greenColor {
    color: green;
  }

  &.redColor {
    color: red;
  }
`);
