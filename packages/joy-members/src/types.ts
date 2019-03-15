import { EnumType, Option } from '@polkadot/types/codec';
import { getTypeRegistry, Bool, BlockNumber, Moment, AccountId, BalanceOf, u64, Text } from '@polkadot/types';

class MemberId extends u64 {}
class PaidTermId extends u64 {}
class SubscriptionId extends u64 {}

export class Paid extends PaidTermId {}
export class Screening extends AccountId {}
export class EntryMethod extends EnumType<Paid | Screening> {
  constructor (value?: any, index?: number) {
    super({
      Paid,
      Screening
    }, value, index);
  }
}

export type Profile = {
  id: MemberId,
  handle: Text,
  avatar_uri: Text,
  about: Text,
  registered_at_block: BlockNumber,
  registered_at_time: Moment,
  entry: EntryMethod,
  suspended: Bool,
  subscription: Option<SubscriptionId>
};

export type UserInfo = {
  handle: Option<Text>,
  avatar_uri: Option<Text>,
  about: Option<Text>
};

export type CheckedUserInfo = {
  handle: Text,
  avatar_uri: Text,
  about: Text
};

export type PaidMembershipTerms = {
  id: PaidTermId,
  fee: BalanceOf,
  text: Text
};

export function registerMembershipTypes () {
  try {
    const typeRegistry = getTypeRegistry();
    // Register enum EntryMethod and its options:
    typeRegistry.register({
      Paid,
      Screening,
      EntryMethod
    });
    typeRegistry.register({
      MemberId,
      PaidTermId,
      SubscriptionId,
      Profile: {
        id: 'MemberId',
        handle: 'Text',
        avatar_uri: 'Text',
        about: 'Text',
        registered_at_block: 'BlockNumber',
        registered_at_time: 'Moment',
        entry: 'EntryMethod',
        suspended: 'Bool',
        subscription: 'Option<SubscriptionId>'
      },
      UserInfo: {
        handle: 'Option<Text>',
        avatar_uri: 'Option<Text>',
        about: 'Option<Text>'
      },
      CheckedUserInfo: {
        handle: 'Text',
        avatar_uri: 'Text',
        about: 'Text'
      },
      PaidMembershipTerms: {
        id: 'PaidTermId',
        fee: 'BalanceOf',
        text: 'Text'
      }
    });
  } catch (err) {
    console.error('Failed to register custom types of membership module', err);
  }
}
