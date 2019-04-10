import { Enum, Struct, Option, Vector } from '@polkadot/types/codec';
import { getTypeRegistry, u64, Bool, Text, BlockNumber, Moment, AccountId, Hash } from '@polkadot/types';
import { OptionText } from '@polkadot/joy-utils/types';

export class DataObjectTypeId extends u64 {}
export class DataObjectStorageRelationshipId extends u64 {}
export class ContentId extends Hash {}
export class SchemaId extends u64 {}
export class DownloadSessionId extends u64 {}

export type BlockAndTimeType = {
  block: BlockNumber,
  time: Moment
};

export class BlockAndTime extends Struct {
  constructor (value?: BlockAndTimeType) {
    super({
      block: BlockNumber,
      time: Moment
    }, value);
  }

  get block (): BlockNumber {
    return this.get('block') as BlockNumber;
  }

  get time (): Moment {
    return this.get('time') as Moment;
  }
}

// TODO rename to Draft to Unlisted
export type ContentVisibilityKey = 'Draft' | 'Public';

export class ContentVisibility extends Enum {
  constructor (value?: ContentVisibilityKey) {
    super([
      'Draft',
      'Public'
    ], value);
  }
}

export class VecContentId extends Vector.with(ContentId) {}

export type ContentMetadataJsonV1 = {
  name: string,
  description?: string,
  thumbnail?: string,
  keywords?: string
};

export class ContentMetadata extends Struct {
  constructor (value?: any) {
    super({
      owner: AccountId,
      added_at: BlockAndTime,
      children_ids: VecContentId,
      visibility: ContentVisibility,
      schema: SchemaId,
      json: Text
    }, value);
  }

  get owner (): AccountId {
    return this.get('owner') as AccountId;
  }

  get added_at (): BlockAndTime {
    return this.get('added_at') as BlockAndTime;
  }

  get children_ids (): VecContentId {
    return this.get('children_ids') as VecContentId;
  }

  get visibility (): ContentVisibility {
    return this.get('visibility') as ContentVisibility;
  }

  get schema (): SchemaId {
    return this.get('schema') as SchemaId;
  }

  get json (): Text {
    return this.get('json') as Text;
  }

  parseJson (): ContentMetadataJsonV1 {
    return JSON.parse(this.json.toString());
  }
}

export class OptionVecContentId extends Option.with(VecContentId) {}
export class OptionSchemaId extends Option.with(SchemaId) {}
export class OptionContentVisibility extends Option.with(ContentVisibility) {}

export type ContentMetadataUpdateType = {
  children_ids: OptionVecContentId,
  visibility: OptionContentVisibility,
  schema: OptionSchemaId,
  json: OptionText
};

export class ContentMetadataUpdate extends Struct {
  constructor (value?: ContentMetadataUpdateType) {
    super({
      children_ids: OptionVecContentId,
      visibility: OptionContentVisibility,
      schema: OptionSchemaId,
      json: OptionText
    }, value);
  }
}

export type LiaisonJudgementKey = 'Pending' | 'Accepted' | 'Rejected';

export class LiaisonJudgement extends Enum {
  constructor (value?: LiaisonJudgementKey) {
    super([
      'Pending',
      'Accepted',
      'Rejected'
    ], value);
  }
}

export class DataObject extends Struct {
  constructor (value?: any) {
    super({
      owner: AccountId,
      added_at: BlockAndTime,
      type_id: DataObjectTypeId,
      size: u64,
      liaison: AccountId,
      liaison_judgement: LiaisonJudgement
    }, value);
  }

  get owner (): AccountId {
    return this.get('owner') as AccountId;
  }

  get added_at (): BlockAndTime {
    return this.get('added_at') as BlockAndTime;
  }

  get type_id (): DataObjectTypeId {
    return this.get('type_id') as DataObjectTypeId;
  }

  /** Actually it's 'size', but 'size' is already reserved by a parent class. */
  get size_in_bytes (): u64 {
    return this.get('size') as u64;
  }

  get liaison (): AccountId {
    return this.get('liaison') as AccountId;
  }

  get liaison_judgement (): LiaisonJudgement {
    return this.get('liaison_judgement') as LiaisonJudgement;
  }
}

export class DataObjectStorageRelationship extends Struct {
  constructor (value?: any) {
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

export class DataObjectType extends Struct {
  constructor (value?: any) {
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

export class DownloadSession extends Struct {
  constructor (value?: any) {
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
      SchemaId,
      ContentId,
      ContentVisibility,
      ContentMetadata,
      ContentMetadataUpdate,
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
