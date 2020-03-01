/* eslint-disable comma-dangle */
/* eslint-disable lines-between-class-members */
/* eslint-disable @typescript-eslint/camelcase */
import { Bytes, Text, u32, Null } from '@polkadot/types';
import { Option, Struct, Enum } from '@polkadot/types/codec';
import { AccountId } from '@polkadot/types/interfaces';
import { Registry } from '@polkadot/types/types';

export class MetadataRecord extends Struct {
  constructor (registry: Registry, value: any) {
    super(registry, {
      avatar: Text,
      display_name: Text,
      tagline: Text,
    }, value);
  }
  get avatar (): Text {
    return this.get('avatar') as Text;
  }
  get display_name (): Text {
    return this.get('display_name') as Text;
  }
  get tagline (): Text {
    return this.get('tagline') as Text;
  }
}

export class Registered extends Null { }
export class Attested extends Null { }
export class Verified extends Null { }

export class IdentityStage extends Enum {
  constructor (registry: Registry, value?: string, index?: number) {
    super(registry, {
      registered: Registered,
      attested: Attested,
      verified: Verified,
    }, value, index);
  }
}

export class IdentityRecord extends Struct {
  constructor (registry: Registry, value: any) {
    super(registry, {
      account: 'AccountId',
      identity_type: Text,
      identity: Bytes,
      stage: IdentityStage,
      expiration_time: u32,
      proof: Option.with(Text),
      metadata: Option.with(MetadataRecord),
    }, value);
  }
  get account (): AccountId {
    return this.get('account') as AccountId;
  }
  get identity (): Bytes {
    return this.get('identity') as Bytes;
  }
  get stage (): IdentityStage {
    return this.get('stage') as IdentityStage;
  }
  get expiration_time (): u32 {
    return this.get('expiration_time') as u32;
  }
  get proof (): Option<Text> {
    return this.get('proof') as Option<Text>;
  }
  get metadata (): Option<MetadataRecord> {
    return this.get('metadata') as Option<MetadataRecord>;
  }
}

// Old types that aren't used anymore (kept for backwards compatability)
const ArchivedTypes = {
  IdentityIndex: u32,
  Claim: Bytes,
};

// Current types
const CurrentTypes = {
  IdentityStage,
  IdentityRecord,
  MetadataRecord,
  IdentityType: Text,
  Attestation: Bytes,
  Identity: Bytes,
};

export const IdentityTypes = { ...ArchivedTypes, ...CurrentTypes };
