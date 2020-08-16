// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from '@polkadot/apps-routing/types';

import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Badge, Icon } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

interface Props {
  className?: string;
  route: Route;
}

const DUMMY_COUNTER = () => 0;

function Item ({ className, route: { Modal, icon, name, text, useCounter = DUMMY_COUNTER } }: Props): React.ReactElement<Props> {
  const [isModalVisible, toggleModal] = useToggle();
  const count = useCounter();

  const _switchRoute = useCallback(
    (): void => {
      window.location.hash = name;
    },
    [name]
  );

  return (
    <li className={className}>
      <div onClick={Modal ? toggleModal : _switchRoute}>
        <Icon icon={icon} />
        {text}
        {!!count && (
          <Badge
            color='counter'
            info={count}
          />
        )}
      </div>
      {Modal && isModalVisible && (
        <Modal onClose={toggleModal} />
      )}
    </li>
  );
}

export default React.memo(styled(Item)`
  cursor: pointer;
  padding: 0.75rem 3.5rem 0.75rem 1.5rem;
  position: relative;
  white-space: nowrap;

  &.topLevel {
    padding-bottom: 1rem;
  }

  .ui--Badge {
    position: absolute;
    right: 0.25rem;
    top: 0.65rem;
  }

  .ui--Icon {
    margin-right: 0.5rem;
  }
`);
