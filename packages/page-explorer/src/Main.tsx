// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HeaderExtended } from '@polkadot/api-derive/types';
import type { KeyedEvent } from '@polkadot/react-hooks/ctx/types';

import React from 'react';

import { Columar } from '@polkadot/react-components';

import BlockHeaders from './BlockHeaders.js';
import Events from './Events.js';
import Query from './Query.js';
import Summary from './Summary.js';

interface Props {
  eventCount: number;
  events: KeyedEvent[];
  headers: HeaderExtended[];
}

function Main ({ eventCount, events, headers }: Props): React.ReactElement<Props> {
  return (
    <>
      <Query />
      <Summary eventCount={eventCount} />
      <Columar>
        <Columar.Column>
          <BlockHeaders headers={headers} />
        </Columar.Column>
        <Columar.Column>
          <Events
            events={events}
            showToggle
          />
        </Columar.Column>
      </Columar>
    </>
  );
}

export default React.memo(Main);
