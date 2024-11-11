// Copyright 2017-2022 @polkadot/react-components authors & contributors
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

function MarkSuccess ({ children, className = '', content, withIcon = true }: Props): React.ReactElement<Props> {
  return (
    <article className={`mark success ${className}`}>
      {withIcon && <Icon icon='check' />}{content}{children}
    </article>
  );
}

export default React.memo(styled(MarkSuccess)`
  .ui--Icon {
    color: rgb(33 124 0);
    margin-right: 0.5rem;
  }
`);
