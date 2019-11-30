// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StringOrNull } from '@polkadot/react-components/types';
import { AccountId, Balance, BlockNumber, Hash, SessionIndex } from '@polkadot/types/interfaces';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

export interface Slash {
  accountId: AccountId;
  amount: Balance;
}

export interface SessionRewards {
  blockHash: Hash;
  blockNumber: BlockNumber;
  isEventsEmpty: boolean;
  reward: Balance;
  sessionIndex: SessionIndex;
  slashes: Slash[];
}

export interface TxState {
  extrinsic: SubmittableExtrinsic | null;
  isSending: boolean;
  accountId?: StringOrNull;
  onChangeAccountId: (_: StringOrNull) => void;
  sendTx: () => void;
  sendUnsigned: () => void;
}