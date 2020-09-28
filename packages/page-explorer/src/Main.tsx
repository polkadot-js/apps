// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { KeyedEvent } from '@polkadot/react-query/types';

import React from 'react';
import { HeaderExtended } from '@polkadot/api-derive';
import { Columar, Column } from '@polkadot/react-components';

import BlockHeaders from './BlockHeaders';
import Events from './Events';
import Query from './Query';
import Summary from './Summary';

interface Props {
  events: KeyedEvent[];
  headers: HeaderExtended[];
}

function Main ({ events, headers }: Props): React.ReactElement<Props> {
  return (
    <>
      <Query />
      <Summary />
      <Columar>
        <Column>
          <BlockHeaders headers={headers} />
        </Column>
        <Column>
          <Events events={events} />
        </Column>
      </Columar>
    </>
  );
}

export default React.memo(Main);
