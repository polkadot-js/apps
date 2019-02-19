import { stringToU8a } from '@polkadot/util';
import { AccountId } from '@polkadot/types';

export const Names: { [s: string]: string } = {
  Alice:   'Alice',
  Bob:     'Bob',
  Charlie: 'Charlie',
  Dave:    'Dave',
  Eve:     'Eve'
};

export const Addresses: { [s: string]: string } = {
  Alice:   '5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ',
  Bob:     '5Gw3s7q4QLkSWwknsiPtjujPv3XM4Trxi5d4PgKMMk3gfGTE',
  Charlie: '5FmE1Adpwp1bT1oY95w59RiSPVu9QwzBGjKsE2hxemD2AFs8',
  Dave:    '5GQATTPFqkfze7kbGuvezhV921FwSp6Xyr8FMW1pmi6LjDuu',
  Eve:     '5CNLHq4doqBbrrxLCxAakEgaEvef5tjSrN7QqJwcWzNd7W7k'
};

export const AccountIds: { [s: string]: AccountId } = {
  Alice:   getIdByName(Names.Alice),
  Bob:     getIdByName(Names.Bob),
  Charlie: getIdByName(Names.Charlie),
  Dave:    getIdByName(Names.Dave),
  Eve:     getIdByName(Names.Eve)
};

export const AccountIdsArray: AccountId[] = Object.keys(AccountIds).map(name => AccountIds[name]);

function getIdByName (name: string): AccountId {
  return new AccountId(stringToU8a(Addresses[name]));
}
