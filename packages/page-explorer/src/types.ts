// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber, EventRecord } from '@polkadot/types/interfaces';

export interface KeyedEvent {
  blockHash?: string;
  blockNumber?: BlockNumber;
  index?: number;
  key: string;
  record: EventRecord;
}
