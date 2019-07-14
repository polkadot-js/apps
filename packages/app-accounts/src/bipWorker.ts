// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { cryptoWaitReady, mnemonicGenerate, mnemonicToMiniSecret, naclKeypairFromSeed, schnorrkelKeypairFromSeed } from '@polkadot/util-crypto';

const ctx: Worker = self as unknown as Worker;

cryptoWaitReady().catch((): void => {
  // ignore
});

ctx.onmessage = async ({ data: { pairType } }): Promise<void> => {
  await cryptoWaitReady();

  const seed = mnemonicGenerate();
  const miniSecret = mnemonicToMiniSecret(seed);
  const { publicKey } = pairType === 'sr25519'
    ? schnorrkelKeypairFromSeed(miniSecret)
    : naclKeypairFromSeed(miniSecret);

  ctx.postMessage({
    publicKey,
    seed
  });
};
