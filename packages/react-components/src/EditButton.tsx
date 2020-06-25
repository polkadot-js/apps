// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IconName } from '@fortawesome/fontawesome-svg-core';
import { BareProps, VoidFn } from './types';

import React from 'react';

import Button from './Button';
import styled from 'styled-components';

interface Props extends BareProps {
  children?: React.ReactNode;
  icon?: IconName;
  onClick: VoidFn;
  size?: 'mini' | 'tiny' | 'small' | 'large' | 'big' | 'huge' | 'massive';
}

function EditButton ({ children, className, icon = 'edit', onClick, size = 'small' }: Props): React.ReactElement<Props> {
  return (
    <div
      className={className}
      onClick={onClick}
    >
      {children}
      <span className='editSpan'>
        <Button
          className='icon-button show-on-hover'
          icon={icon}
          isPrimary
          size={size}
        />
      </span>
    </div>
  );
}

export default React.memo(styled(EditButton)`
  cursor: pointer;

  button.u.ui--Icon.primary.button.icon-button {
    cursor: pointer;
  }

  .editSpan {
    white-space: nowrap;
  }
`);
