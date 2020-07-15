// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import Icon from './Icon';

interface Props {
  className?: string;
  href?: string;
  icon?: string;
  label?: React.ReactNode;
  rel?: string;
  target?: string;
  onClick: () => void;
}

function IconLink ({ className = '', href, icon, label, onClick, rel, target }: Props): React.ReactElement<Props> {
  return (
    <a
      className={className}
      href={href}
      onClick={onClick}
      rel={rel}
      target={target}
    >
      {icon && <Icon className={icon} />}
      {label}
    </a>
  );
}

export default React.memo(styled(IconLink)`
  font-size: 0.9rem !important;

  &:hover {
    text-decoration: underline;

    i {
      text-decoration: none;
    }
  }
`);
