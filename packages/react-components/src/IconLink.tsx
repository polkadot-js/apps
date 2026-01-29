// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';

import React from 'react';

import Icon from './Icon.js';
import { styled } from './styled.js';

interface Props {
  className?: string;
  href?: string;
  icon?: IconName;
  label?: React.ReactNode;
  rel?: string;
  target?: string;
  onClick?: () => void;
}

function IconLink ({ className = '', href, icon, label, onClick, rel, target }: Props): React.ReactElement<Props> {
  return (
    <StyledA
      className={className}
      href={href}
      onClick={onClick}
      rel={rel}
      target={target}
    >
      {icon && <Icon icon={icon} />}
      {label}
    </StyledA>
  );
}

const StyledA = styled.a`
  .ui--Icon {
    margin-right: 0.5em;
  }
`;

export default React.memo(IconLink);
