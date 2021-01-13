// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ItemRoute } from './types';

import React from 'react';
import styled from 'styled-components';

import { Badge, Icon } from '@polkadot/react-components';
import { ThemeProps } from '@polkadot/react-components/types';
import { useToggle } from '@polkadot/react-hooks';

interface Props {
  className?: string;
  isToplevel?: boolean;
  route: ItemRoute;
}

const DUMMY_COUNTER = () => 0;

function Item ({ className = '', isToplevel, route: { Modal, href, icon, name, text, useCounter = DUMMY_COUNTER } }: Props): React.ReactElement<Props> {
  const [isModalVisible, toggleModal] = useToggle();
  const count = useCounter();

  return (
    <li className={`${className}${count ? ' withCounter' : ''} ${isToplevel ? 'topLevel  highlight--color-contrast' : ''}`}>
      <a
        href={Modal ? undefined : (href || `#/${name}`)}
        onClick={Modal ? toggleModal : undefined}
        rel='noopener noreferrer'
        target={href ? '_blank' : undefined}
      >
        <Icon icon={icon} />
        {text}
        {!!count && (
          <Badge
            color='counter'
            info={count}
          />
        )}
      </a>
      {Modal && isModalVisible && (
        <Modal onClose={toggleModal} />
      )}
    </li>
  );
}

export default React.memo(styled(Item)(({ theme } : ThemeProps) => `
  cursor: pointer;
  position: relative;
  white-space: nowrap;

  &.topLevel {
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.5rem;
    border-radius: 0.15rem 0.15rem 0 0;
    a {
      padding: 1rem 1.15rem 1.25rem;
    }
    &:hover {
      background-color: ${theme.bgMenu};
      color: ${theme.color};
    }

    &.isActive.highlight--color-contrast {
      background-color: ${theme.bgTabs};
      color: ${theme.color};
      font-size: 1.15rem;
      font-weight: 600;
    }
  }

  &.withCounter a {
    padding-right: 3rem;
  }

  a {
    color: inherit !important;
    display: block;
    padding: 0.5rem 1.15rem 0.57rem;
    text-decoration: none;
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.5rem;
  }

  .ui--Badge {
    position: absolute;
    right: 0.25rem;
  }

  .ui--Icon {
    margin-right: 0.5rem;
  }
`));
