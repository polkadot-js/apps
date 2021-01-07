// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '@polkadot/react-query/types';

import React from 'react';

import { HeaderExtended } from '@polkadot/api-derive';
import { Columar } from '@polkadot/react-components';

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
        <Columar.Column>
          <BlockHeaders headers={headers} />
        </Columar.Column>
        <Columar.Column>
          <Events events={events} />
        </Columar.Column>
      </Columar>
    </>
  );
}

export default React.memo(Main);
