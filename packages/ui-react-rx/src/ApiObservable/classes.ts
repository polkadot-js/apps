// Copyright 2017-2018 @polkadot/ui-observable authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';
import { AccountId, Balance, BlockNumber, PropIndex, Proposal, ReferendumIndex, VoteThreshold } from '@polkadot/api-codec/index';
import { Struct, Tuple, Vector } from '@polkadot/api-codec/codec';

export class RxProposal extends Struct.with({ id: PropIndex, proposal: Proposal, address: AccountId }) {
  constructor (value: Tuple) {
    super({
      id: value.get(0),
      proposal: value.get(1),
      address: value.get(2)
    });
  }

  get address (): AccountId {
    return this.raw.address as AccountId;
  }

  get id (): PropIndex {
    return this.raw.id as PropIndex;
  }

  get proposal (): Proposal {
    return this.raw.proposal as Proposal;
  }
}

export class RxProposalDeposits extends Struct.with({ balance: Balance, addresses: Vector.with(AccountId) }) {
  constructor (value: Tuple) {
    super({
      balance: value.get(0),
      addresses: value.get(1)
    });
  }

  get addresses (): Vector<AccountId> {
    return this.raw.addresses as Vector<AccountId>;
  }

  get balance (): Balance {
    return this.raw.balance as Balance;
  }
}

export class RxReferendum extends Struct.with({ blockNumber: BlockNumber, proposal: Proposal, voteThreshold: VoteThreshold, id: ReferendumIndex }) {
  constructor (value: Tuple, id: ReferendumIndex | BN | number) {
    super({
      blockNumber: value.get(0),
      proposal: value.get(1),
      voteThreshold: value.get(2),
      id
    });
  }

  get blockNumber (): BlockNumber {
    return this.raw.blockNumber as BlockNumber;
  }

  get id (): ReferendumIndex {
    return this.raw.id as ReferendumIndex;
  }

  get proposal (): Proposal {
    return this.raw.proposal as Proposal;
  }

  get voteThreshold (): VoteThreshold {
    return this.raw.voteThreshold as VoteThreshold;
  }
}
