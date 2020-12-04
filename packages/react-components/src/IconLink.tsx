// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
      {icon && <Icon icon={icon} />}
      {label}
    </a>
  );
}

export default React.memo(styled(IconLink)`
  .ui--Icon {
    margin-right: 0.5em;
  }
`);
