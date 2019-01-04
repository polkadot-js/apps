// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { mnemonicGenerate, mnemonicToSeed, naclKeypairFromSeed } from '@polkadot/util-crypto';

const ctx: Worker = self as any;

ctx.onmessage = () => {
  const seed = mnemonicGenerate();
  const { publicKey } = naclKeypairFromSeed(
    mnemonicToSeed(seed)
  );

  ctx.postMessage({
    publicKey,
    seed
  });
};
