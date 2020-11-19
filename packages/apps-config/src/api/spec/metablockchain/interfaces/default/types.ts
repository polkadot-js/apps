// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Bytes, Struct } from '@polkadot/types';
import type { Hash } from '@polkadot/types/interfaces/runtime';

/** @name DidStruct */
export interface DidStruct extends Struct {
  readonly identifier: Bytes;
  readonly public_key: Hash;
  readonly metadata: Bytes;
}

/** @name identifier */
export interface identifier extends Bytes {}

/** @name metadata */
export interface metadata extends Bytes {}

/** @name PeerId */
export interface PeerId extends Bytes {}

/** @name public_key */
export interface public_key extends Hash {}

/** @name PublicSigningKey */
export interface PublicSigningKey extends Hash {}

export type PHANTOM_DEFAULT = 'default';
