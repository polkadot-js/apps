// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { mnemonicGenerate, mnemonicToSeed, naclKeypairFromSeed } from '@polkadot/util-crypto';
import { encodeAddress } from '@polkadot/keyring';

const ctx: Worker = self as any;

ctx.onmessage = () => {
  const seed = mnemonicGenerate();
  const keypair = naclKeypairFromSeed(
    mnemonicToSeed(seed)
  );
  const address = encodeAddress(
    keypair.publicKey
  );

  ctx.postMessage({
    address,
    seed
  });
};
