// Copyright 2017-2022 @polkadot/app-claims authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EcdsaSignature, EthereumAddress, StatementKind } from '@polkadot/types/interfaces';

import secp256k1 from 'secp256k1/elliptic';

import registry from '@polkadot/react-api/typeRegistry';
import { assert, hexToU8a, stringToU8a, u8aConcat, u8aToBuffer } from '@polkadot/util';
import { keccakAsHex, keccakAsU8a } from '@polkadot/util-crypto';

interface RecoveredSignature {
  error: Error | null;
  ethereumAddress: EthereumAddress | null;
  signature: EcdsaSignature | null;
}

interface SignatureParts {
  recovery: number;
  signature: Buffer;
}

// converts an Ethereum address to a checksum representation
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

// convert a give public key to an Ethereum address (the last 20 bytes of an _exapnded_ key keccack)
export function publicToAddr (publicKey: Uint8Array): string {
  return addrToChecksum(`0x${keccakAsHex(publicKey).slice(-40)}`);
}

// hash a message for use in signature recovery, adding the standard Ethereum header
export function hashMessage (message: string): Buffer {
  const expanded = stringToU8a(`\x19Ethereum Signed Message:\n${message.length.toString()}${message}`);
  const hashed = keccakAsU8a(expanded);

  return u8aToBuffer(hashed);
}

// split is 65-byte signature into the r, s (combined) and recovery number (derived from v)
export function sigToParts (_signature: string): SignatureParts {
  const signature = hexToU8a(_signature);

  assert(signature.length === 65, `Invalid signature length, expected 65 found ${signature.length}`);

  let v = signature[64];

  if (v < 27) {
    v += 27;
  }

  const recovery = v - 27;

  assert(recovery === 0 || recovery === 1, 'Invalid signature v value');

  return {
    recovery,
    signature: u8aToBuffer(signature.slice(0, 64))
  };
}

// recover an address from a given message and a recover/signature combination
export function recoverAddress (message: string, { recovery, signature }: SignatureParts): string {
  const msgHash = hashMessage(message);
  const senderPubKey = secp256k1.recover(msgHash, signature, recovery);

  return publicToAddr(
    secp256k1.publicKeyConvert(senderPubKey, false).slice(1)
  );
}

// recover an address from a signature JSON (as supplied by e.g. MyCrypto)
export function recoverFromJSON (signatureJson: string | null): RecoveredSignature {
  try {
    const { msg, sig } = JSON.parse(signatureJson || '{}') as Record<string, string>;

    if (!msg || !sig) {
      throw new Error('Invalid signature object');
    }

    const parts = sigToParts(sig);

    return {
      error: null,
      ethereumAddress: registry.createType('EthereumAddress', recoverAddress(msg, parts)),
      signature: registry.createType('EcdsaSignature', u8aConcat(parts.signature, new Uint8Array([parts.recovery])))
    };
  } catch (error) {
    console.error(error);

    return {
      error: error as Error,
      ethereumAddress: null,
      signature: null
    };
  }
}

export interface Statement {
  sentence: string;
  url: string;
}

function getPolkadot (kind?: StatementKind | null): Statement | undefined {
  if (!kind) {
    return undefined;
  }

  const url = kind.isRegular
    ? 'https://statement.polkadot.network/regular.html'
    : 'https://statement.polkadot.network/saft.html';
  const hash = kind.isRegular
    ? 'Qmc1XYqT6S39WNp2UeiRUrZichUWUPpGEThDE6dAb3f6Ny'
    : 'QmXEkMahfhHJPzT3RjkXiZVFi77ZeVeuxtAjhojGRNYckz';

  return {
    sentence: `I hereby agree to the terms of the statement whose SHA-256 multihash is ${hash}. (This may be found at the URL: ${url})`,
    url
  };
}

export function getStatement (network: string, kind?: StatementKind | null): Statement | undefined {
  switch (network) {
    case 'Polkadot':
    case 'Polkadot CC1':
      return getPolkadot(kind);

    default:
      return undefined;
  }
}
