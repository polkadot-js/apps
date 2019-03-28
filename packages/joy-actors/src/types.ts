import { Enum, Struct } from '@polkadot/types/codec';
import { getTypeRegistry, BlockNumber, AccountId, Balance, u32 } from '@polkadot/types';
import { MemberId } from '@polkadot/joy-members/types';

export class Role extends Enum {
  constructor (value?: any) {
    super([
      'Storage',
    ], value);
  }
}

export type Actor = {
  member_id: MemberId,
  role: Role,
  account: AccountId,
  joined_at: BlockNumber
}

export type Request = [AccountId, MemberId, Role, BlockNumber];
export type Requests = Array<Request>;


export class RoleParameters extends Struct {
  constructor(value?: any) {
    super({
      min_stake: Balance,
      max_actors: u32,
      min_actors: u32,
      reward: Balance,
      reward_period: BlockNumber,
      unbonding_period: BlockNumber,
      bonding_time: BlockNumber,
      min_service_period: BlockNumber,
      startup_grace_period: BlockNumber,
    }, value)
  }
}

export function registerActorsTypes() {
  try {
    const typeRegistry = getTypeRegistry();
    typeRegistry.register({
      Role,
      RoleParameters: {
        min_stake: 'Balance',
        max_actors: 'u32',
        min_actors: 'u32',
        reward: 'Balance',
        reward_period: 'BlockNumber',
        unbonding_period: 'BlockNumber',
        bonding_time: 'BlockNumber',
        min_service_period: 'BlockNumber',
        startup_grace_period: 'BlockNumber',
      },
      Request: '(AccountId, MemberId, Role, BlockNumber)',
      Requests: 'Vec<Request>',
      Actor: {
        member_id: 'MemberId',
        role: 'Role',
        account: 'AccountId',
        joined_at: 'BlockNumber',
      },
    });
  } catch (err) {
    console.error('Failed to register custom types of actors module', err);
  }
}
