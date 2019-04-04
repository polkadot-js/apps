import { Enum, Struct, Option } from '@polkadot/types/codec';
import { getTypeRegistry, u64, Bool, Text, BlockNumber, Moment, AccountId, AuthorityId } from '@polkadot/types';

export class Ed25519AuthorityId extends AuthorityId {}
export class DataObjectTypeId extends u64 {}
export class DataObjectStorageRelationshipId extends u64 {}
export class ContentId extends u64 {}
export class MetadataId extends u64 {}
export class SchemaId extends u64 {}
export class DownloadSessionId extends u64 {}

export type MetadataStateKey = 'Draft' | 'Published';

export class MetadataState extends Enum {
  constructor (value?: MetadataStateKey) {
    super([
      'Draft',
      'Published'
    ], value);
  }
}

export type MetadataType = {
  schema: SchemaId,
  metadata: Text,
  origin: AccountId,
  state: MetadataState
};

export class ContentMetadata extends Struct {
  constructor (value?: MetadataType) {
    super({
      schema: SchemaId,
      metadata: Text,
      origin: AccountId,
      state: MetadataState
    }, value);
  }

  get schema (): SchemaId {
    return this.get('schema') as SchemaId;
  }

  get metadata (): Text {
    return this.get('metadata') as Text;
  }

  get origin (): AccountId {
    return this.get('origin') as AccountId;
  }

  get state (): MetadataState {
    return this.get('state') as MetadataState;
  }
}

export type LiaisonJudgementKey = 'Pending' | 'Rejected' | 'Accepted';

export class LiaisonJudgement extends Enum {
  constructor (value?: LiaisonJudgementKey) {
    super([
      'Pending',
      'Rejected',
      'Accepted'
    ], value);
  }
}

export class OptionAuthorityId extends Option.with(Ed25519AuthorityId) {}

export type DataObjectTsType = {
  data_object_type: DataObjectTypeId,
  signing_key: OptionAuthorityId,
  size: u64,
  added_at_block: BlockNumber,
  added_at_time: Moment,
  owner: AccountId,
  liaison: AccountId,
  liaison_judgement: LiaisonJudgement
};

export class DataObject extends Struct {
  constructor (value?: DataObjectTsType) {
    super({
      data_object_type: DataObjectTypeId,
      signing_key: OptionAuthorityId,
      size: u64,
      added_at_block: BlockNumber,
      added_at_time: Moment,
      owner: AccountId,
      liaison: AccountId,
      liaison_judgement: LiaisonJudgement
    }, value);
  }

  get data_object_type (): DataObjectTypeId {
    return this.get('data_object_type') as DataObjectTypeId;
  }

  get signing_key (): OptionAuthorityId {
    return this.get('signing_key') as OptionAuthorityId;
  }

  /** Actually it's 'size', but 'size' is already reserved by a parent class. */
  get size_in_bytes (): u64 {
    return this.get('size') as u64;
  }

  get added_at_block (): BlockNumber {
    return this.get('added_at_block') as BlockNumber;
  }

  get added_at_time (): Moment {
    return this.get('added_at_time') as Moment;
  }

  get owner (): AccountId {
    return this.get('owner') as AccountId;
  }

  get liaison (): AccountId {
    return this.get('liaison') as AccountId;
  }

  get liaison_judgement (): LiaisonJudgement {
    return this.get('liaison_judgement') as LiaisonJudgement;
  }
}

export type DataObjectStorageRelationshipType = {
  content_id: ContentId,
  storage_provider: AccountId,
  ready: Bool
};

export class DataObjectStorageRelationship extends Struct {
  constructor (value?: DataObjectStorageRelationshipType) {
    super({
      content_id: ContentId,
      storage_provider: AccountId,
      ready: Bool
    }, value);
  }

  get content_id (): ContentId {
    return this.get('content_id') as ContentId;
  }

  get storage_provider (): AccountId {
    return this.get('storage_provider') as AccountId;
  }

  get ready (): Bool {
    return this.get('ready') as Bool;
  }
}

export type DataObjectTypeType = {
  description: Text,
  active: Bool
};

export class DataObjectType extends Struct {
  constructor (value?: DataObjectTypeType) {
    super({
      description: Text,
      active: Bool
    }, value);
  }

  get description (): Text {
    return this.get('description') as Text;
  }

  get active (): Bool {
    return this.get('active') as Bool;
  }
}

export type DownloadStateKey = 'Started' | 'Ended';

export class DownloadState extends Enum {
  constructor (value?: DownloadStateKey) {
    super([
      'Started',
      'Ended'
    ], value);
  }
}
export type DownloadSessionType = {
  content_id: ContentId,
  consumer: AccountId,
  distributor: AccountId,
  initiated_at_block: BlockNumber,
  initiated_at_time: Moment,
  state: DownloadState,
  transmitted_bytes: u64
};

export class DownloadSession extends Struct {
  constructor (value?: DownloadSessionType) {
    super({
      content_id: ContentId,
      consumer: AccountId,
      distributor: AccountId,
      initiated_at_block: BlockNumber,
      initiated_at_time: Moment,
      state: DownloadState,
      transmitted_bytes: u64
    }, value);
  }

  get content_id (): ContentId {
    return this.get('content_id') as ContentId;
  }

  get consumer (): AccountId {
    return this.get('consumer') as AccountId;
  }

  get distributor (): AccountId {
    return this.get('distributor') as AccountId;
  }

  get initiated_at_block (): BlockNumber {
    return this.get('initiated_at_block') as BlockNumber;
  }

  get initiated_at_time (): Moment {
    return this.get('initiated_at_time') as Moment;
  }

  get state (): DownloadState {
    return this.get('state') as DownloadState;
  }

  get transmitted_bytes (): u64 {
    return this.get('transmitted_bytes') as u64;
  }
}

export function registerMediaTypes () {
  try {
    getTypeRegistry().register({
      '::ContentId': ContentId,
      '::DataObjectTypeId': DataObjectTypeId,
      Ed25519AuthorityId,
      ContentId,
      SchemaId,
      MetadataState,
      MetadataId,
      ContentMetadata,
      LiaisonJudgement,
      DataObject,
      DataObjectStorageRelationshipId,
      DataObjectStorageRelationship,
      DataObjectTypeId,
      DataObjectType,
      DownloadState,
      DownloadSessionId,
      DownloadSession
    });
  } catch (err) {
    console.error('Failed to register custom types of media module', err);
  }
}
