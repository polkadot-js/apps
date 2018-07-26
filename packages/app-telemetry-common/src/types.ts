import { Opaque, Maybe } from './helpers';
import { Id } from './id';

export type FeedVersion = Opaque<number, 'FeedVersion'>;
export type ChainLabel = Opaque<string, 'ChainLabel'>;
export type FeedId = Id<'Feed'>;
export type NodeId = Id<'Node'>;
export type NodeName = Opaque<string, 'NodeName'>;
export type NodeImplementation = Opaque<string, 'NodeImplementation'>;
export type NodeVersion = Opaque<string, 'NodeVersion'>;
export type BlockNumber = Opaque<number, 'BlockNumber'>;
export type BlockHash = Opaque<string, 'BlockHash'>;
export type Milliseconds = Opaque<number, 'Milliseconds'>;
export type Timestamp = Opaque<Milliseconds, 'Timestamp'>;
export type PropagationTime = Opaque<Milliseconds, 'PropagationTime'>;
export type NodeCount = Opaque<number, 'NodeCount'>;
export type PeerCount = Opaque<number, 'PeerCount'>;
export type TransactionCount = Opaque<number, 'TransactionCount'>;
export type Latitude = Opaque<number, 'Latitude'>;
export type Longitude = Opaque<number, 'Longitude'>;
export type City = Opaque<string, 'City'>;

export type BlockDetails = [BlockNumber, BlockHash, Milliseconds, Timestamp, Maybe<PropagationTime>];
export type NodeDetails = [NodeName, NodeImplementation, NodeVersion];
export type NodeStats = [PeerCount, TransactionCount];
export type NodeLocation = [Latitude, Longitude, City];
