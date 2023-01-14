// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import Icon from './Icon';

interface Props {
  children?: React.ReactNode;
  className?: string;
  content?: React.ReactNode;
  withIcon?: boolean;
}

function MarkWarning ({ children, className = '', content, withIcon = true }: Props): React.ReactElement<Props> {
  return (
    <article className={`mark warning ${className}`}>
      {withIcon && <Icon icon='exclamation-triangle' />}{content}{children}
    </article>
  );
}

export default React.memo(styled(MarkWarning)`
  .ui--Icon {
    color: rgba(255, 196, 12, 1);
    margin-right: 0.5rem;
  }
`);
