// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ItemRoute } from './types';

import React from 'react';
import styled from 'styled-components';

import { Badge, Icon } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

interface Props {
  className?: string;
  isLink?: boolean;
  isToplevel?: boolean;
  route: ItemRoute;
}

const DUMMY_COUNTER = () => 0;

function Item ({ className = '', isLink, isToplevel, route: { Modal, href, icon, name, text, useCounter = DUMMY_COUNTER } }: Props): React.ReactElement<Props> {
  const [isModalVisible, toggleModal] = useToggle();
  const count = useCounter();

  return (
    <li className={`ui--MenuItem ${className}${count ? ' withCounter' : ''} ${isLink ? 'isLink' : ''} ${isToplevel ? 'topLevel  highlight--color-contrast' : ''}`}>
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
            color={'white'}
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
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.214rem;
    border-radius: 0.15rem;

    a {
      padding: 0.857rem 0.857em 0.857rem 1rem;
      line-height: 1.214rem;
      border-radius: 0.25rem;
    }

    &.isActive.highlight--color-contrast {
      font-size: 1.15rem;
      font-weight: 400;
      color: var(--color-text);

      a {
        background-color: var(--bg-tabs);
      }
    }

    &.isActive {
      border-radius: 0.15rem 0.15rem 0 0;

      a {
        padding: 0.857rem 1.429rem 0.857rem;
        cursor: default;
      }

      &&.withCounter a {
        padding-right: 3.2rem;
      }
    }

    .ui--Badge {
      top: 0.7rem;
    }
  }

  &&.withCounter a {
    padding-right: 3.2rem;
  }

  a {
    color: inherit !important;
    display: block;
    padding: 0.5rem 1.15rem 0.57rem;
    text-decoration: none;
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.5rem;
  }

  .ui--Badge {
    position: absolute;
    right: 0.5rem;
  }

  .ui--Icon {
    margin-right: 0.5rem;
  }
`);
