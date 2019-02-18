import typeRegistry from '@polkadot/types/codec/typeRegistry';
import { Enum, EnumType } from '@polkadot/types/codec';
import { BlockNumber, AccountId, Balance, u32, Text } from '@polkadot/types';

export type ProposalId = u32;

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
}

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
      ProposalStatus,
      VoteKind
    });

    typeRegistry.register({
      // 'Id': 'AccountId',
      'Stake': {
        'new': 'Balance',
        'transferred': 'Balance'
      },
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
      'Proposal': {
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
