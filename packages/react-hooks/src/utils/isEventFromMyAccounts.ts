// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { GenericExtrinsic, Vec } from '@polkadot/types';
import type { AccountId, EventRecord } from '@polkadot/types/interfaces';
import type { AnyTuple } from '@polkadot/types-codec/types';

import { stringToHex } from '@polkadot/util';

export const isEventFromMyAccounts = (newEvent: EventRecord, extrinsics: Vec<GenericExtrinsic<AnyTuple>>, author: AccountId | undefined, allAccounts: string[]) => {
  const { event, phase } = newEvent;

  // 1. check if any event arg matches one of the accounts
  const involvesInArgs = event.data.some((args) =>
    allAccounts.some((account) => args.toString().includes(account) || args.toString().includes(stringToHex(account)))
  );

  // 2. check if extrinsic signer matches
  let involvesInSigner = false;

  if (phase.isApplyExtrinsic) {
    const index = phase.asApplyExtrinsic.toNumber();
    const ext = extrinsics[index];

    if (ext?.signer) {
      involvesInSigner = allAccounts.includes(ext.signer.toString());
    }
  }

  // 3. check if block author is in user's accounts
  const involvesInAuthor = author && allAccounts.includes(author.toString());

  return involvesInArgs || involvesInSigner || involvesInAuthor;
};
