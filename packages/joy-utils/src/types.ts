import { Enum, EnumType, Option } from '@polkadot/types/codec';
import { getTypeRegistry, BlockNumber, AccountId, Balance, Hash, u32, Text } from '@polkadot/types';

class Amount extends Balance {}

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

// Note: this could be named 'RuntimeUpgradeProposal' (as it is in Rust),
// but not a big deal here in JS.
export type Proposal = {
  id: u32,
  proposer: AccountId,
  stake: Balance,
  name: Text, // or AnyU8a?
  description: Text,
  wasm_hash: Hash,
  proposed_at: BlockNumber,
  status: ProposalStatus
};

export type ProposalVote = {
  voter: AccountId,
  kind: VoteKind
};

export type TallyResult = {
  proposal_id: u32,
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

export const ProposalStatuses: { [key: string ]: string } = {
  Active:    'Active',
  Cancelled: 'Cancelled',
  Expired:   'Expired',
  Approved:  'Approved',
  Rejected:  'Rejected',
  Slashed:   'Slashed'
};

export class ProposalStatus extends Enum {
  constructor (value?: any) {
    super([
      'Active',
      'Cancelled',
      'Expired',
      'Approved',
      'Rejected',
      'Slashed'
    ], value);
  }
}

export const VoteKinds: { [key: string ]: string } = {
  Abstain: 'Abstain',
  Approve: 'Approve',
  Reject:  'Reject',
  Slash:   'Slash'
};

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

export type ProposalVotes = [AccountId, VoteKind][];

export function registerJoystreamTypes () {
  try {
    // Register parametrized enum ElectionStage:
    const typeRegistry = getTypeRegistry();
    typeRegistry.register({
      Announcing,
      Voting,
      Revealing,
      ElectionStage
    });
    typeRegistry.register({
      Amount
    });
    typeRegistry.register({
      ProposalStatus,
      VoteKind
    });
    typeRegistry.register({
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
      'RuntimeUpgradeProposal': {
        'id': 'u32',
        'proposer': 'AccountId',
        'stake': 'Balance',
        'name': 'Text',
        'description': 'Text',
        'wasm_hash': 'Hash',
        'proposed_at': 'BlockNumber',
        'status': 'ProposalStatus'
      },
      'TallyResult': {
        'proposal_id': 'u32',
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
