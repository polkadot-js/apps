// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ItemRoute } from './types';

import React from 'react';
import styled from 'styled-components';

import { Badge, Icon } from '@polkadot/react-components';
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
    <li className={`${className}${count ? ' withCounter' : ''} ${isToplevel ? 'topLevel  highlight--color-contrast' : 'highlight--hover-color'}`}>
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
            color={isToplevel ? 'counterInvert' : 'counter'}
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

export default React.memo(styled(Item)`
  cursor: pointer;
  position: relative;
  white-space: nowrap;

  &.topLevel {
    font-size: 1.15rem;
    font-weight: 600;
    line-height: 1.5rem;
    border-radius: 0.15rem 0.15rem 0 0;

    &:hover {
      background-color: white;
    }

    & a  {
    padding: 1.2rem 1.25rem 1.2rem 1.5rem;

   }

    .ui--Badge {
      top: 0.95rem;
    }
    &.isActive.highlight--color-contrast {
      background-color: #fff;
      color: #000;
      margin-bottom: -3px;
    }
  }

  &.withCounter a {
    padding-right: 3rem;
  }

  a {
    color: inherit !important;
    display: block;
    padding: 0.75rem 1.5rem;
    text-decoration: none;
  }

  .ui--Badge {
    position: absolute;
    right: 0.25rem;
    top: 0.7rem;
  }

  .ui--Icon {
    margin-right: 0.5rem;
  }
`);
