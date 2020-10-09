// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconName } from '@fortawesome/fontawesome-svg-core';
import { VoidFn } from './types';

import React from 'react';
import styled from 'styled-components';

import { colorLink } from './styles/theme';
import Icon from './Icon';

interface Props {
  children?: React.ReactNode;
  className?: string;
  icon?: IconName;
  onClick: VoidFn;
}

function EditButton ({ children, className, icon = 'edit', onClick }: Props): React.ReactElement<Props> {
  return (
    <div
      className={className}
      onClick={onClick}
    >
      {children}
      <span className='editSpan'>
        <Icon
          className='icon-button'
          icon={icon}
        />
      </span>
    </div>
  );
}

export default React.memo(styled(EditButton)`
  cursor: pointer;

  .ui--Icon.icon-button {
    color: ${colorLink};
    cursor: pointer;
    margin: 0 0 0 0.5rem;
  }

  .editSpan {
    white-space: nowrap;
  }
`);
