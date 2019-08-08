/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { createType } from '@polkadot/types';
import { EcdsaSignature, EthereumAddress } from '@polkadot/types/interfaces';
// import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
// import { ComponentProps } from './types';

// import secp256k1 from 'secp256k1/elliptic'
// import { pkToEthAddr } from '@polkadot/ui-app/util';
import { /* formatBalance, bufferToU8a, */ hexToU8a /* , stringToU8a, u8aToBuffer, u8aToString, u8aToHex */ } from '@polkadot/util';
// import { keccakAsU8a, secp256k1Recover } from '@polkadot/util-crypto';

interface RecoveredSignature {
  ethereumAddress: EthereumAddress | null;
  signature: EcdsaSignature | null;
}

// function calculateSignatureRecovery (v: number, chainId?: number): number {
//   return chainId ? v - (2 * chainId + 35) : v - 27;
// }

export function recoverEthereumSignature (signatureJson: string | null): RecoveredSignature {
  let ethereumAddress: EthereumAddress | null = null;
  let signature: EcdsaSignature | null = null;
  try {
    const { msg, sig } = JSON.parse(signatureJson || '{}');

    if (!msg || !sig) {
      throw new Error('Invalid signature object');
    }

    const signatureU8a = hexToU8a(sig);

    // TODO Solve incorrect address recovery
    //
    // const message = keccakAsU8a(stringToU8a(`\x19Ethereum Signed Message:\n${msg}`));
    // const recovery = calculateSignatureRecovery(signatureU8a[signatureU8a.length - 1]);
    //
    // const publicKey = secp256k1.publicKeyConvert(
    //   u8aToBuffer(secp256k1Recover(message, signatureU8a.slice(0, 64), recovery)),
    //   false
    // ).slice(1);
    //
    // // ethereumAddress = createType('EthereumAddress', pkToEthAddr(secp256k1Recover(message, signatureU8a, 0)));
    // ethereumAddress = createType('EthereumAddress', bufferToU8a(publicKey));

    ethereumAddress = createType('EthereumAddress', hexToU8a('0xe71026fcbcecc825f848bcba05cb52bc250bca92'));
    signature = createType('EcdsaSignature', signatureU8a);
  } catch (e) {
    console.error(e);
  }

  if (!signature || !ethereumAddress) {
    return {
      ethereumAddress: null,
      signature: null
    };
  }

  return {
    ethereumAddress,
    signature
  };
}
