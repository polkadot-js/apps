import { createBLAKE2s, createBLAKE2b, blake2s } from 'hash-wasm';
import assert from 'assert';

// hash a file using blake2s-256
export async function blake2sFile(f: Blob): Promise<Uint8Array> {
  try {
    return await blake2sFileFast(f);
  } catch (e) {
    assert(e instanceof DOMException); // file was too large, fall back to streaming hasher
    return await blake2sFileStreaming(f);
  }
}

// hash a file using blake2s-256 hash is done over a single chunk
// this will throw an error if the file is too big
async function blake2sFileFast(f: Blob): Promise<Uint8Array> {
  return blake2s256(new Uint8Array(await f.arrayBuffer()));
}

// hash a file using blake2s-256
async function blake2sFileStreaming(f: Blob): Promise<Uint8Array> {
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

export async function blake2b256(bs: Uint8Array): Promise<Uint8Array> {
  const h = await createBLAKE2b(256);
  h.update(bs);
  return h.digest('binary');
}

async function blake2s256(bs: Uint8Array): Promise<Uint8Array> {
  const h = await createBLAKE2s();
  h.update(bs);
  return h.digest('binary');
}
