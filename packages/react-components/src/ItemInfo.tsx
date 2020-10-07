// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from './types';

import React from 'react';
// import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';

interface Props extends BareProps {
  icon: React.ReactNode;
  subtitle?: React.ReactNode;
  title?: React.ReactNode;
}

function ItemInfo ({ children, className, icon, subtitle, title }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <div className='item-icon'>
        {icon}
      </div>
      <div className='info'>
        <div className='title'>
          {title}
        </div>
        <div className='subtitle'>
          {subtitle}
        </div>
        {children}
      </div>
    </div>
  );
}

export default styled(React.memo(ItemInfo))`
  display: flex;
  align-items: flex-start;

  i.icon.code-icon {
    color: var(--grey60);
    font-size: 1.8rem;
    margin: 1rem;
  }

  .info {
    flex-grow: 1;

    > :not(:first-child) {
      margin-top: 0.25rem;
    }

    .title {
      color: var(--grey90);
      font-size: 1.125rem;
      height: 1.25rem;

      .name-editor {
        background: var(--grey15);

        .ui.input {
          margin: 0;

          > input {
            padding: 0;
          }
        }
      }
    }

    .subtitle {
      color: var(--grey60);
      font-family: monospace;
    }
  }
`;
