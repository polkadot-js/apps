import React, { useState } from 'react';
import Download from './Download';
import { hex, hexproof, ProofElement } from './hrproof';
import { u8aToHex, assert } from '@polkadot/util';
import { blake2b256File } from './hash';
import { CSSProperties } from 'styled-components';
import _ from 'lodash';
import { useApi } from '@polkadot/react-hooks';
import Post from './Post';
import { hexDisplay } from './common';

type Proof = {
  filename: string,
  proof?: ProofElement<Uint8Array>[],
  blake2b256?: Uint8Array,
};

/// a proof with metadata and all hashes converted to hex so they look nice as json
type OutputProof = {
  filename: string,
  proof: ProofElement<string>[],
  content_hash: string,
  root: string,
  hashalg: 'blake2b256',
}

function toOutput(p: Proof, root: Uint8Array): OutputProof {
  assert(p.proof !== undefined && p.blake2b256 !== undefined, 'Proof not in proper format');
  return {
    filename: p.filename,
    proof: hexproof(p.proof),
    content_hash: hex(p.blake2b256),
    root: hex(root),
    hashalg: 'blake2b256',
  };
}

function Batch(): React.ReactElement {
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [root, setRoot] = useState<Uint8Array | null>(null);
  const loading = root === null && proofs.length !== 0;
  assert((!loading) || root === null, 'loading -> (root === null)');
  const api = useApi().api;
  const extrinsic = root === null ? null : api.tx.anchor.deploy(u8aToHex(root));

  async function onFileSelect(files: File[]) {
    const proofs: Proof[] = files.map(f => ({ filename: f.name }));
    setProofs(clone(proofs));
    setRoot(null);

    if (files.length === 0) {
      // can't compute a root of zero leaves
      return;
    }

    const { construct } = await import('mrklt');

    // Processing files in sequence seems to be faster than in processing them in parallel
    // and it helps prevent OOM.
    for (const [f, i] of enumerate(files)) {
      proofs[i].blake2b256 = await blake2b256File(f);
      setProofs(clone(proofs));
    }

    const pl = pack32(proofs.map(p => p.blake2b256 as Uint8Array));
    const [root, merkleproofs] = construct(pl);
    assert(merkleproofs.length === proofs.length, 'Number of proof hashes differ');
    for (let i = 0; i < proofs.length; i++) {
      proofs[i].proof = merkleproofs[i];
    }
    setProofs(proofs);
    setRoot(new Uint8Array(root));
  }

  const topchild = { flex: 1 };

  return <div>
    <div>
      <input
        type='file'
        multiple
        onChange={a => onFileSelect(a.target.files ? [...a.target.files] : [])}
        disabled={loading}
        style={topchild}
      />
    </div>
    <Post extrinsic={extrinsic} />
    {root && <div style={topchild}>Merkle root: {hexDisplay(root)}</div>}
    {root && <div style={topchild}>
      <Download
        filename={'allproofs.json'}
        content={jsonBlob(proofs.map(p => toOutput(p, root)))}
      >Download All Merkle Proofs</Download>
    </div>}
    {table(proofs.map(p => proofrow(p, root)))}
  </div>;
}

function proofrow(proof: Proof, root: Uint8Array | null): React.ReactElement[] {
  let hash = <div style={{ fontFamily: 'monospace', width: '64ch' }}>{
    proof.blake2b256 !== undefined ? hex(proof.blake2b256) : 'hashing...'
  }</div>;
  if (proof.proof !== undefined && root !== null) {
    hash = <Download
      filename={proof.filename + '.proof.json'}
      content={jsonBlob(toOutput(proof, root as Uint8Array))}
    >{hash}</Download>;
  }
  return [
    <div style={{ overflow: 'hidden' }}>{proof.filename}</div>,
    hash,
  ];
}

function table(tab: React.ReactElement[][]): React.ReactElement {
  const parent: CSSProperties = { display: 'flex', flexDirection: 'row', flexFlow: 'spaceBetween' };
  const child: CSSProperties = { flex: 1 };
  return <>{tab.map((row, i) => <div key={i} style={parent}>
    {row.map((elem, i) => <div key={i} style={child}>{elem}</div>)}
  </div>)}</>;
}

function jsonBlob(json: any) {
  return new Blob([JSON.stringify(json, null, 2)], { type: 'text/json' });
}

// pack a list of hashed leaves into a single byte array
function pack32(leaves: Uint8Array[]): Uint8Array {
  for (const leaf of leaves) {
    assert(leaf instanceof Uint8Array);
    assert(leaf.length == 32);
  }
  let ret = new Uint8Array(leaves.map(a => [...a]).flat());
  assert(ret.length === leaves.length * 32);
  return ret;
}

function enumerate<T>(ls: T[]): [T, number][] {
  return ls.map((l, i) => [l, i]);
}

function clone<T>(a: T): T {
  return _.cloneDeep(a);
}

export default React.memo(Batch);
