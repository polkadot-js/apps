// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TFunction } from 'i18next';
import { DeriveParachainInfo } from '@polkadot/api-derive/types';

export function parachainName (t: TFunction, info: DeriveParachainInfo | null): string {
  return info?.name || t<string>('Unknown Chain');
}

export function parachainOwner (t: TFunction, info: DeriveParachainInfo | null): string {
  return info?.owner || t<string>('Unknown Owner');
}
