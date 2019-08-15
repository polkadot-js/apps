/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { createType } from '@polkadot/types';
import { EcdsaSignature, EthereumAddress } from '@polkadot/types/interfaces';
// import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
// import { ComponentProps } from './types';

import secp256k1 from 'secp256k1/elliptic';
import { assert, hexToU8a, stringToU8a, u8aToBuffer } from '@polkadot/util';
import { keccakAsHex, keccakAsU8a } from '@polkadot/util-crypto';

interface RecoveredSignature {
  ethereumAddress: EthereumAddress | null;
  signature: EcdsaSignature | null;
}

export function addrToChecksum (_address: string): string {
  const address = _address.toLowerCase();
  const hash = keccakAsHex(address.substr(2)).substr(2);
  let result = '0x';

  for (let n = 0; n < 40; n++) {
    result = `${result}${
      parseInt(hash[n], 16) > 7
        ? address[n + 2].toUpperCase()
        : address[n + 2]
    }`;
  }

  return result;
}

export function publicToAddr (publicKey: Uint8Array): string {
  return addrToChecksum(`0x${keccakAsHex(publicKey).slice(-40)}`);
}

export function hashMessage (message: string): Buffer {
  return u8aToBuffer(
    keccakAsU8a(
      stringToU8a(`\x19Ethereum Signed Message:\n${message.length.toString()}${message}`)
    )
  );
}

export function sigToParts (_signature: string): { recovery: number; signature: Buffer } {
  const signature = hexToU8a(_signature);

  assert(signature.length === 65, `Invalid signature length, expected 65 found ${signature.length}`);

  let v = signature[64];

  if (v < 27) {
    v += 27;
  }

  const recovery = v - 27;

  assert(recovery === 0 || recovery === 1, `Invalid signature v value`);

  return {
    recovery,
    signature: u8aToBuffer(signature.slice(0, 64))
  };
}

export function recoverAddress (message: string, _signature: string): string {
  const { signature, recovery } = sigToParts(_signature);
  const msgHash = hashMessage(message);
  const senderPubKey = secp256k1.recover(msgHash, signature, recovery);

  return publicToAddr(
    secp256k1.publicKeyConvert(senderPubKey, false).slice(1)
  );
}

export function recoverEthereumSignature (signatureJson: string | null): RecoveredSignature {
  let ethereumAddress: EthereumAddress | null = null;
  let signature: EcdsaSignature | null = null;

  try {
    const { msg, sig } = JSON.parse(signatureJson || '{}');

    if (!msg || !sig) {
      throw new Error('Invalid signature object');
    }

    ethereumAddress = createType('EthereumAddress', recoverAddress(msg, sig));
    signature = createType('EcdsaSignature', sig);
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
