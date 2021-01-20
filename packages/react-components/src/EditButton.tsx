// Copyright 2017-2021 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { VoidFn } from '@canvas-ui/react-util/types';
import type { IconName } from '@fortawesome/fontawesome-common-types';

import React from 'react';
import { IconProps } from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon';
import styled from 'styled-components';

import Button from './Button';
import { BareProps } from './types';

interface Props extends BareProps {
  children?: React.ReactNode;
  icon?: IconName;
  onClick: VoidFn;
  size?: IconProps['size'];
}

function EditButton ({ children, className, icon = 'edit', onClick }: Props): React.ReactElement<Props> {
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
        />
      </span>
    </div>
  );
}

export default React.memo(styled(EditButton)`
  cursor: pointer;

  .editSpan {
    white-space: nowrap;
  }
`);
