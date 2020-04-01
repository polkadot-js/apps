// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import Icon from './Icon';
import { classes } from './util';

export interface InsetProps {
  className?: string;
  children?: React.ReactNode;
  isCollapsible?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  header?: React.ReactNode;
  href?: string | null;
  withTopMargin?: boolean;
  withBottomMargin?: boolean;
}

function Inset ({ children, className, header, href, isCollapsible, isError, isSuccess, withBottomMargin, withTopMargin }: InsetProps): React.ReactElement<InsetProps> | null {
  const history = useHistory();
  const [isCollapsed, setIsCollapsed] = useState(true);

  if (!children) {
    return null;
  }

  const _onClick = (): void => {
    href && history.push(href);
  };

  const _toggleCollapsed = (): void => setIsCollapsed(!isCollapsed);

  return (
    <div
      className={
        classes(
          'ui--Inset',
          href && 'as-link',
          isCollapsible && 'collapsible',
          (isError && !isSuccess) && 'error',
          (!isError && isSuccess) && 'success',
          withBottomMargin && 'bottom-margin',
          withTopMargin && 'top-margin',
          className
        )
      }
    >
      {isCollapsible && (
        <div
          className='header'
          onClick={_toggleCollapsed}
        >
          <h3>{header}</h3>
          <Icon
            className={classes(isCollapsed && 'collapsed')}
            name='angle up'
          />
        </div>
      )}
      <div
        className={classes('children', (isCollapsible && isCollapsed) && 'collapsed')}
        onClick={_onClick}
      >
        {children}
      </div>
    </div>
  );
}

export default React.memo(styled(Inset)`
  & {
    box-shadow: 0 3px 3px rgba(0,0,0,.2);
    position: relative;
    background: #fefefe;
    padding: 1rem;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;

    &.bottom-margin {
      margin-bottom: 2rem;
    }

    &.top-margin {
      margin-top: 2rem;
    }

    &.error {
      background: rgba(255, 0, 0, 0.05);

      &, h1, h2, h3, h4, h5, h6, p {
        color: rgba(156, 0, 0) !important;
      }
    }

    &.success {
      border: 1px solid rgb(168, 255, 136);
      background: rgba(0, 255, 0, 0.05);

      &, h1, h2, h3, h4, h5, h6, p {
        color: rgba(34, 125, 0) !important;
      }
    }

    .header {
      cursor: pointer;
      height: 2rem;
      width: 100%;

      h3 {
        line-height: 2rem;
        margin-bottom: 0;
      }

      .icon {
        height: 4rem;
        width: 4rem;
        font-size: 2rem;
        color: rgba(0,0,0,0.35);
        position: absolute;
        right: 0;
        top: 0;
        line-height: 4rem;
        transition: all 0.2s;
        transform-origin: center center;

        &.collapsed {
          transform: rotate(180deg);
        }
      }
    }

    .children {
      &.collapsed {
        display: none;
      }
    }

    &.as-link {
      cursor: pointer;

      &:hover {
        box-shadow: 0 5px 5px rgba(0,0,0,.2);
        transform: translateY(-2px);
      }
    }
  }
`);
