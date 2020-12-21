// this module converts proofs to and from hex strings to make them easy to read when serialized as
// json

// import assert from 'assert';
import { u8aToHex, hexToU8a, assert } from '@polkadot/util';

export function hex(bs: Uint8Array): string {
  return u8aToHex(bs, undefined, false);
}

export function dehex(str: string): Uint8Array {
  return hexToU8a('0x' + str);
}

export function hexproof(merkleProof: ProofElement<Uint8Array>[]): ProofElement<string>[] {
  return merkleProof.map(pe => map(pe, hex));
}

export function dehexproof(merkleProof: ProofElement<string>[]): ProofElement<number[]>[] {
  return merkleProof.map(pe => map(pe, h => [...dehex(h)]));
}

export type Left<T> = { Left: T };
export type Right<T> = { Right: T };
export type ProofElement<Hash> = Left<Hash> | Right<Hash>;

function map<A, B>(pe: ProofElement<A>, f: (_: A) => B): ProofElement<B> {
  assert(('Left' in pe) !== ('Right' in pe), 'Either both Left and Right present or both absent');
  return mapDict(pe, f) as ProofElement<B>;
}

// map a js dict of K -> A to a dict of K -> B using f which is a function from
// A -> B
export function mapDict<A, B>(kv: Record<string, A>, f: (_: A) => B): Record<string, B> {
  let ret: Record<string, B> = {};
  for (const [k, v] of Object.entries(kv)) {
    ret[k] = f(v);
  }
  return ret;
}
