// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProps } from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon';
import { VoidFn } from '@canvas-ui/react-util/types';
import { BareProps } from './types';

import React from 'react';

import Button from './Button';
import styled from 'styled-components';

interface Props extends BareProps {
  children?: React.ReactNode;
  icon?: string;
  onClick: VoidFn;
  size?: IconProps['size'];
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
          isIcon
          isPrimary
          size={size}
        />
      </span>
    </div>
  );
}

export default React.memo(styled(EditButton)`
  cursor: pointer;

  button.ui.icon.primary.button.icon-button {
    cursor: pointer;
  }

  .editSpan {
    white-space: nowrap;
  }
`);
