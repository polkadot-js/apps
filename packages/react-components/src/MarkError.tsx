// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import Icon from './Icon';

interface Props {
  children?: React.ReactNode;
  className?: string;
  content?: React.ReactNode;
}

function MarkError ({ children, className = '', content }: Props): React.ReactElement<Props> {
  return (
    <article className={`mark error ${className}`}>
      <Icon icon='exclamation-triangle' />{content}{children}
    </article>
  );
}

export default React.memo(styled(MarkError)`
  .ui--Icon {
    color: rgba(255, 12, 12, 1);
    margin-right: 0.5rem;
  }
`);
