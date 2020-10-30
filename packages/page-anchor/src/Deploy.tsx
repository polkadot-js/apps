import React, { useState } from 'react';
import assert from 'assert';
import Download from './Download';
import { hex, hexproof, ProofElement } from './hrproof';
import { createBLAKE2s } from 'hash-wasm';

function Deploy(): React.ReactElement {
  const [files, setFiles] = useState<File[]>([]);
  const [filehashes, setFileHashes] = useState<Uint8Array[]>([]);
  const [proofs, setProofs] = useState<Record<string, ProofElement<string>[]>>({});
  const [root, setRoot] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const individualProofs = files.map(f => (
    <div key={f.name}>
      <Download filename={f.name + '.proof.json'} content={jsonBlob(proofs[f.name])}>
        {f.name}
      </Download>
    </div>
  ));

  async function onFileSelect(files: File[]) {
    setFiles(files);
    setProofs({});
    setRoot(null);
    setLoading(true);

    if (files.length === 0) {
      // can't compute a root of zero leaves
      return;
    }

    const { compute_root, create_proof } = await import('mrklt');

    // Processing files in sequence is faster than in processing them in parallel
    // according to benchmarks on this machine:
    // CPU: AMD Ryzen 9 3900X 12- (24) @ 3.800GHz
    // HD: SanDisk SDSSDH3 1T02
    const ls = [];
    for (const f of files) {
      ls.push(await blake2sFile(f));
      setFileHashes([...ls]);
    }
    const pl = pack32(ls);
    // const pl = pack32(await Promise.all(files.map(blake2sFile)));

    setProofs(collect(files.map((f, i) => [f.name, hexproof(create_proof(i, pl))])));
    setRoot(compute_root(pl));
    setLoading(false);
  }

  return (
    <div>
      <input
        type='file'
        multiple
        onChange={a => onFileSelect(a.target.files ? [...a.target.files] : [])}
        disabled={loading}
      />
      {root === null && <>
        {files.map((f, i) => (<div style={{
          display: 'flex',
          alignItems: 'space-between',
          flexDirection: 'row'
        }}>
          <div style={{ flex: 1 }}>{f.name}</div>
          <div style={{ fontFamily: 'monospace' }}>{filehashes[i] ? hex(filehashes[i]) : ''}</div>
        </div>))}
      </>}
      {
        root !== null && <>
          <div>
            {individualProofs}
          </div>
          <Download
            filename='allproofs.json'
            content={jsonBlob({ proofs, root: hex(root) })}
          >
            Download All Proofs
        </Download>
        </>
      }
      {
        loading && <div>
          Loading...
      </div>
      }
    </div >
  );
}

function jsonBlob(json: any) {
  return new Blob([JSON.stringify(json, null, 2)], { type: 'text/json' });
}

// hash a file using blake2s-256
async function blake2sFile(f: Blob): Promise<Uint8Array> {
  const h = await createBLAKE2s();
  await processStream(f.stream(), bs => h.update(bs));
  return h.digest('binary');
}

// call f on every chunk of a stream
async function processStream(rs: ReadableStream<Uint8Array>, f: (_: Uint8Array) => void) {
  // https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream
  const reader = rs.getReader();
  while (true) {
    const { done, value } = await reader.read();
    assert((value === undefined) === done);
    if (done) { break; }
    f(value as Uint8Array);
  }
  reader.releaseLock();
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

function collect<V>(inp: [string, V][]): Record<string, V> {
  const ret: Record<string, V> = {};
  inp.forEach(([k, v]) => { ret[k] = v; });
  return ret;
}

export default React.memo(Deploy);
