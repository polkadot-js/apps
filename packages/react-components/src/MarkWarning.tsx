// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Icon from './Icon.js';
import { styled } from './styled.js';

interface Props {
  children?: React.ReactNode;
  className?: string;
  content?: React.ReactNode;
  withIcon?: boolean;
}

function MarkWarning ({ children, className = '', content, withIcon = true }: Props): React.ReactElement<Props> {
  return (
    <StyledArticle className={`${className} mark warning`}>
      {withIcon && <Icon icon='exclamation-triangle' />}{content}{children}
    </StyledArticle>
  );
}

const StyledArticle = styled.article`
  .ui--Icon {
    color: rgba(255, 196, 12, 1);
    margin-right: 0.5rem;
  }
`;

export default React.memo(MarkWarning);
