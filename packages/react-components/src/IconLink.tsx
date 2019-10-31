// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import styled from 'styled-components';

import Icon from './Icon';

interface Props extends BareProps {
  icon?: string;
  label?: React.ReactNode;
  onClick: () => void;
}

function IconLink ({ className, icon, label, onClick }: Props): React.ReactElement<Props> {
  return (
    <a
      className={className}
      onClick={onClick}
    >
      {icon && <Icon className={icon} />}
      {label}
    </a>
  );
}

export default styled(IconLink)`
  font-size: 0.9rem !important;

  &:hover {
    text-decoration: underline;

    i {
      text-decoration: none;
    }
  }
`;
