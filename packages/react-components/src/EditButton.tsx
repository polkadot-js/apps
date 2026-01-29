// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';

import React from 'react';

import { colorLink } from './styles/theme.js';
import Icon from './Icon.js';
import { styled } from './styled.js';

interface Props {
  children?: React.ReactNode;
  className?: string;
  icon?: IconName;
  onClick?: () => void;
}

function EditButton ({ children, className = '', icon = 'edit', onClick }: Props): React.ReactElement<Props> {
  return (
    <StyledDiv
      className={`${className} ui--EditButton`}
      onClick={onClick}
    >
      {children}
      <span className='editSpan'>
        <Icon
          className='icon-button'
          icon={icon}
        />
      </span>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  cursor: pointer;

  .ui--Icon.icon-button {
    color: ${colorLink};
    cursor: pointer;
    margin: 0 0 0 0.5rem;
  }

  .editSpan {
    white-space: nowrap;
  }
`;

export default React.memo(EditButton);
