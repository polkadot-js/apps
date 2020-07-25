// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
