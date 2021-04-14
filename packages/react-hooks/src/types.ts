// Copyright 2017-2021 @polkadot/react-components authors & contributors
// and @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { StringOrNull, VoidFn } from '@canvas-ui/react-util/types';
import BN from 'bn.js';

import { DeriveAccountFlags, DeriveAccountRegistration } from '@polkadot/api-derive/types';
import { KeyringJson$Meta } from '@polkadot/ui-keyring/types';

export type CallParam = any;

export type CallParams = [] | CallParam[];

export interface CallOptions <T> {
  defaultValue?: T;
  isSingle?: boolean;
  paramMap?: (params: any) => CallParams;
  transform?: (value: any) => T;
  withParams?: boolean;
}

export interface AddressFlags extends DeriveAccountFlags {
  isDevelopment: boolean;
  isEditable: boolean;
  isExternal: boolean;
  isFavorite: boolean;
  isHardware: boolean;
  isInContacts: boolean;
  isInjected: boolean;
  isMultisig: boolean;
  isProxied: boolean;
  isOwned: boolean;
}

export interface AddressIdentity extends DeriveAccountRegistration {
  isGood: boolean;
  isBad: boolean;
  isKnownGood: boolean;
  isReasonable: boolean;
  isErroneous: boolean;
  isLowQuality: boolean;
  isExistent: boolean;
  waitCount: number;
}

export interface UseAccountInfo {
  accountIndex?: string;
  flags: AddressFlags;
  name: string;
  setName: React.Dispatch<string>;
  tags: string[];
  setTags: React.Dispatch<string[]>;
  genesisHash: StringOrNull;
  identity?: AddressIdentity;
  isEditingName: boolean;
  meta?: KeyringJson$Meta;
  toggleIsEditingName: VoidFn;
  isEditingTags: boolean;
  isNull: boolean;
  toggleIsEditingTags: VoidFn;
  onSaveName: VoidFn;
  onSaveTags: VoidFn;
  onSetGenesisHash: (genesisHash: string | null) => void;
  onForgetAddress: VoidFn;
}

export interface UseWeight {
  executionTime: number;
  isEmpty: boolean;
  isValid: boolean;
  megaGas: BN;
  percentage: number;
  setIsEmpty: React.Dispatch<boolean>
  setMegaGas: React.Dispatch<BN | undefined>;
  weight: BN;
}

export interface FileState {
  data: Uint8Array;
  name: string;
  size: number;
}

export type UseFile = [FileState | null, React.Dispatch<FileState | null>, boolean, boolean];

export interface EndpointUrl {
  isValid: boolean;
  url: string;
}

export interface Endpoint extends EndpointUrl {
  isCustom: boolean;
}

export interface UseEndpoints extends Endpoint {
  onChangeUrl: (_: string) => void;
  onChangeCustom: (_: boolean) => void;
}

export interface AppNavigation {
  instantiate: VoidFn;
  instantiateAdd: VoidFn;
  instantiateNew: (_?: string, __?: number) => VoidFn;
  instantiateSuccess: (_: string) => VoidFn;
  execute: VoidFn;
  executeAdd: VoidFn;
  executeCall: (_: string, __?: number) => VoidFn;
  upload: VoidFn;
  uploadSuccess: (_: string) => VoidFn;
}

export interface AppPaths {
  instantiate: string;
  instantiateAdd: string;
  instantiateNew: (_?: string, __?: number) => string;
  instantiateSuccess: (_: string) => string;
  execute: string;
  executeAdd: string;
  executeCall: (_: string, __?: number) => string;
  upload: string;
  uploadSuccess: (_: string) => string;
}
