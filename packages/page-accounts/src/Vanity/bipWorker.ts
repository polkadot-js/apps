// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { cryptoWaitReady, ed25519PairFromSeed, mnemonicGenerate, mnemonicToMiniSecret, sr25519PairFromSeed } from '@polkadot/util-crypto';

const ctx: Worker = self as unknown as Worker;

cryptoWaitReady().catch((): void => {
  // ignore
});

ctx.onmessage = async ({ data: { pairType } }): Promise<void> => {
  await cryptoWaitReady();

  const seed = mnemonicGenerate();
  const miniSecret = mnemonicToMiniSecret(seed);
  const { publicKey } = pairType === 'sr25519'
    ? sr25519PairFromSeed(miniSecret)
    : ed25519PairFromSeed(miniSecret);

  ctx.postMessage({
    publicKey,
    seed
  });
};
