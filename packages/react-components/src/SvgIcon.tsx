// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  icon: string;
  onClick?: () => void;
  size?: '1x' | '2x';
  tooltip?: string;
}

function SvgIcon ({ className = '', icon, onClick, size = '1x', tooltip }: Props): React.ReactElement<Props> {
  const extraProps = tooltip
    ? { 'data-for': tooltip, 'data-tip': true }
    : {};

  return (
    <div className={`ui--Icon ${onClick ? ' isClickable' : ''} ${className}`}>
      <img
        {...extraProps}
        onClick={onClick}
        sizes={size}
        src={icon}
      />
    </div>
  );
}

export default React.memo(styled(SvgIcon)`
  display: inline-flex !important;
  justify-content: center !important;

  &.isClickable {
    cursor: pointer;
  }
`);
