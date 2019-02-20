import { AccountId } from '@polkadot/types';

export type HashedVote = {
  applicantId: string,
  salt: string,
  hash: string
};

// Keyring / identicon / address
// -----------------------------------

import createItem from '@polkadot/ui-keyring/options/item';
import { findNameByAddress } from '@polkadot/joy-utils/index';

const createAddressOption = (address: string) => {
  let name = findNameByAddress(address);
  return createItem(address, name);
};

export const accountIdsToOptions = (applicants: Array<AccountId>): any => {
  if (applicants && applicants.length) {
    return applicants.map(a => {
      const addr = a.toString();
      return createAddressOption(addr);
    });
  }
  return [];
};

// Hash
// -----------------------------------

import { decodeAddress } from '@polkadot/keyring';
import { stringToU8a } from '@polkadot/util';
import { blake2AsHex } from '@polkadot/util-crypto';

/** hash(accountId + salt) */
export const hashVote = (accountId?: string, salt?: string): string | undefined => {
  if (!accountId || !salt) {
    console.log('Cannot hash a vote: either accountId or salt is undefined', { accountId, salt });
    return undefined;
  }

  const accountU8a = decodeAddress(accountId);
  const saltU8a = stringToU8a(salt);
  const voteU8a = new Uint8Array(accountU8a.length + saltU8a.length);
  voteU8a.set(accountU8a);
  voteU8a.set(saltU8a, accountU8a.length);

  const hash = blake2AsHex(voteU8a, 256);
  // console.log('Vote hash:', hash, 'for', { accountId, salt });
  return hash;
};
