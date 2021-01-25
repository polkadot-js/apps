// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/settings/types';
import type { Codec } from '@polkadot/types/types';

import React from 'react';

export function sliceHex (value: Codec, max: number): string {
  const hex = value.toHex();

  return hex.length > ((2 * max) + 2)
    ? `${hex.slice(0, max + 2)}…${hex.slice(-max)}`
    : hex;
}

export function getChainLink (endpoints: LinkOption[]): React.ReactNode {
  if (!endpoints.length) {
    return null;
  }

  const { text, value } = endpoints[endpoints.length - 1];

  return <a href={`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(value)}`}>{text}</a>;
}
