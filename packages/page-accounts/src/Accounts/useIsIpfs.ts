// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useState } from 'react';

const KNOWN = ['/ipfs/', '/ipns/'];

export default function useIsIpfs (): boolean {
  const [isIpfs] = useState(KNOWN.some((part) => window.location.href.includes(part)));

  return isIpfs;
}
