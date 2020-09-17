// Copyright 2017-2020 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BlockNumber, EventRecord } from '@polkadot/types/interfaces';

export interface IndexedEvent {
  indexes: number[];
  record: EventRecord;
}

export interface KeyedEvent extends IndexedEvent {
  blockHash?: string;
  blockNumber?: BlockNumber;
  key: string;
}
