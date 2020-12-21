import { createBLAKE2b } from 'hash-wasm';
import { assert } from '@polkadot/util';

// hash a file using blake2b-256
export async function blake2b256File(f: Blob): Promise<Uint8Array> {
  try {
    // attempt to hash file as a single chunk. f.arrayBuffer() will throw an error if the file is
    // too big.
    return blake2b256(new Uint8Array(await f.arrayBuffer()));
  } catch (e) {
    assert(e instanceof DOMException, 'error should be an instance of DOMException'); // file was too large, fall back to streaming hasher
    return await blake2b256Streaming(f);
  }
}

// hash a file using blake2b-256
async function blake2b256Streaming(f: Blob): Promise<Uint8Array> {
  const h = await createBLAKE2b(256);
  await processStream(f.stream(), bs => h.update(bs));
  return h.digest('binary');
}

// call f on every chunk of a stream
async function processStream(rs: ReadableStream<Uint8Array>, f: (_: Uint8Array) => void) {
  // https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream
  const reader = rs.getReader();
  while (true) {
    const { done, value } = await reader.read();
    assert((value === undefined) === done, '`done` and `value` were inconsistent');
    if (done) { break; }
    f(value as Uint8Array);
  }
  reader.releaseLock();
}

export async function blake2b256(bs: Uint8Array): Promise<Uint8Array> {
  const h = await createBLAKE2b(256);
  h.update(bs);
  return h.digest('binary');
}
