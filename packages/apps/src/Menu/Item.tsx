// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from '@polkadot/apps-routing/types';

import React, { useCallback } from 'react';
import { Badge, Icon } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

interface Props {
  route: Route;
}

const DUMMY_COUNTER = () => 0;

function Item ({ route: { Modal, icon, name, text, useCounter = DUMMY_COUNTER } }: Props): React.ReactElement<Props> {
  const [isModalVisible, toggleModal] = useToggle();
  const count = useCounter();

  const _switchRoute = useCallback(
    (): void => {
      window.location.hash = name;
    },
    [name]
  );

  return (
    <li>
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

export default React.memo(Item);
