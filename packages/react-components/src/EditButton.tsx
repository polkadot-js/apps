// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';
import React from 'react';
import styled from 'styled-components';

import type { VoidFn } from './types';
import Icon from './Icon';
import { colorLink } from './styles/theme';

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
