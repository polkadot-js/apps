// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from '@polkadot/apps-routing/types';

import React from 'react';
import { Badge, Icon } from '@polkadot/react-components';

interface Props {
  onClick: () => void;
  route: Route;
}

const DUMMY_COUNTER = () => 0;

function Item ({ onClick, route: { icon, text, useCounter = DUMMY_COUNTER } }: Props): React.ReactElement<Props> {
  const count = useCounter();

  return (
    <li onClick={onClick}>
      <Icon icon={icon} />
      {text}
      {!!count && (
        <Badge
          color='counter'
          info={count}
        />
      )}
    </li>
  );
}

export default React.memo(Item);
