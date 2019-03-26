// import { EnumType, Option, Struct } from '@polkadot/types/codec';
// import { getTypeRegistry, Bool, BlockNumber, Moment, AccountId, BalanceOf, u64, Text } from '@polkadot/types';

import { getTypeRegistry, u64 } from '@polkadot/types';

export class MediaTypeShouldGoHere extends u64 {}

export function registerMembershipTypes () {
  try {
    const typeRegistry = getTypeRegistry();
    typeRegistry.register({
      MediaTypeShouldGoHere
    });
  } catch (err) {
    console.error('Failed to register custom types of media module', err);
  }
}
