import typeRegistry from '@polkadot/types/codec/typeRegistry';
import { Enum, EnumType, Option } from '@polkadot/types/codec';
import { BlockNumber, AccountId, Balance, Hash, u32, Text } from '@polkadot/types';

class Amount extends Balance {};

export type TransferableStake = {
  seat: Balance,
  backing: Balance
};

export type Stake = {
  new: Balance,
  transferred: Balance
};

export type Backer = {
  member: AccountId,
  stake: Balance
};

export type Seat = {
  member: AccountId,
  stake: Balance,
  backers: Backer[]
};

export type SealedVote = {
  voter: AccountId,
  commitment: Hash,
  stake: Stake,
  vote: Option<AccountId>
};

export type ProposalId = u32;

// Note: this could be named 'RuntimeUpgradeProposal' (as it is in Rust),
// but not a big deal here in JS.
export type Proposal = {
  id: ProposalId,
  proposer: AccountId,
  stake: Balance,
  name: Text, // or AnyU8a?
  description: Text,
  wasm_code: Text,
  proposed_at: BlockNumber,
  status: ProposalStatus
};

export type ProposalVote = {
  voter: AccountId,
  kind: VoteKind
};

export type TallyResult = {
  proposal_id: ProposalId,
  abstentions: u32,
  approvals: u32,
  rejections: u32,
  slashes: u32,
  status: ProposalStatus,
  finalized_at: BlockNumber
};

export class Announcing extends BlockNumber { }
export class Voting extends BlockNumber { }
export class Revealing extends BlockNumber { }

export class ElectionStage extends EnumType<Announcing | Voting | Revealing> {
  constructor (value?: any, index?: number) {
    super({
      Announcing,
      Voting,
      Revealing
    }, value, index);
  }

  /** Create a new Announcing stage. */
  static Announcing (endsAt: BlockNumber | number): ElectionStage {
    return this.newElectionStage(Announcing.name, endsAt);
  }

  /** Create a new Voting stage. */
  static Voting (endsAt: BlockNumber | number): ElectionStage {
    return this.newElectionStage(Voting.name, endsAt);
  }

  /** Create a new Revealing stage. */
  static Revealing (endsAt: BlockNumber | number): ElectionStage {
    return this.newElectionStage(Revealing.name, endsAt);
  }

  static newElectionStage (stageName: string, endsAt: BlockNumber | number) {
    return new ElectionStage({ [stageName]: endsAt });
  }
}

export type AnyElectionStage = Announcing | Voting | Revealing;

export class ProposalStatus extends Enum {
  constructor (value?: any) {
    super([
      'Pending', // TODO rename to 'Active'
      'Cancelled',
      'Expired',
      'Approved',
      'Rejected',
      'Slashed'
    ], value);
  }
}

export class VoteKind extends Enum {
  constructor (value?: any) {
    super([
      'Abstain',
      'Approve',
      'Reject',
      'Slash'
    ], value);
  }
}

export function registerJoystreamTypes () {
  try {
    // Register parametrized enum ElectionStage:
    typeRegistry.register({
      Announcing,
      Voting,
      Revealing,
      ElectionStage
    });
    typeRegistry.register({
      Amount,
    })
    typeRegistry.register({
      ProposalStatus,
      VoteKind
    });

    typeRegistry.register({
      'Id': 'AccountId',
      'Stake': {
        'new': 'Balance',
        'transferred': 'Balance'
      },
      'Backer': {
        member: 'AccountId',
        stake: 'Balance'
      },
      'Seat': {
        member: 'AccountId',
        stake: 'Balance',
        backers: 'Vec<Backer>'
      },
      'Seats': 'Vec<Seat>',
      'SealedVote': {
        'voter': 'AccountId',
        'commitment': 'Hash',
        'stake': 'Stake',
        'vote': 'Option<AccountId>'
      },
      'TransferableStake': {
        'seat': 'Balance',
        'backing': 'Balance'
      },
      'ProposalId': 'u32',
      'RuntimeUpgradeProposal': {
        'id': 'ProposalId',
        'proposer': 'AccountId',
        'stake': 'Balance',
        'name': 'Vec<u8>',
        'description': 'Vec<u8>',
        'wasm_code': 'Vec<u8>',
        'proposed_at': 'BlockNumber',
        'status': 'ProposalStatus'
      },
      'TallyResult': {
        'proposal_id': 'ProposalId',
        'abstentions': 'u32',
        'approvals': 'u32',
        'rejections': 'u32',
        'slashes': 'u32',
        'status': 'ProposalStatus',
        'finalized_at': 'BlockNumber'
      }
    });
  } catch (err) {
    console.error('Failed to register custom types of Joystream node', err);
  }
}
