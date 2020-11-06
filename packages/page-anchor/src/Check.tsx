import React, { useState, useEffect } from 'react';
import { ProofElement, dehexproof } from './hrproof';
import { blake2sFile, blake2b256 } from './hash';
import { u8aToHex } from '@polkadot/util';
import { useApi } from '@polkadot/react-hooks';
import ApiPromise from '@polkadot/api/promise';

type AnchorStatus = {
  tag: 'posted',
  data: number,
} | {
  tag: 'notposted',
} | {
  tag: 'checking',
} | {
  tag: 'waiting',
} | {
  tag: 'err',
  data: string,
} | {
  tag: 'hashing',
};

/* function depends<T, R>(compute: (_: T) => Promise<R>, dat: T, initial: R): R {
 *   const [ret, setRet] = useState<R>(initial);
 *   useEffect(() => { compute(dat).then(setRet); }, [dat]);
 *   return ret;
 * }
 *  */
function Check(): React.ReactElement {
  const [file, setFile] = useState<File | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);

  // derived data
  const [anchorStatus, setAnchorStatus] = useState<AnchorStatus>({ tag: 'waiting' });
  const nc = useApi().api;
  const gimmeASecond = anchorStatus.tag === 'checking' || anchorStatus.tag === 'hashing';

  const reset = () => {
    setAnchorStatus({ tag: 'waiting' });
  };
  const err = (e: Error) => {
    reset();
    setAnchorStatus({ tag: 'err', data: e.toString() });
    throw e;
  };
  const trya = (af: () => Promise<any>) => () => { af().catch(err); };

  useEffect(trya(async () => {
    reset();
    if (file === null) { return; }

    setAnchorStatus({ tag: 'hashing' });
    const fileHash = await blake2sFile(file);

    const proof = proofFile === null ? [] : await proofFromFile(proofFile);
    const root = await vproof(fileHash, proof);

    setAnchorStatus({ tag: 'checking' });
    const block = await check(root, nc);

    setAnchorStatus(block === null ? { tag: 'notposted' } : { tag: 'posted', data: block });
  }), [file, proofFile]);

  return <div>
    <div>File to verify: <input
      type="file"
      onChange={async e => {
        if (e.target.files === null || e.target.files.length === 0) {
          setFile(null);
        } else {
          setFile(e.target.files[0]);
        }
      }}
      disabled={gimmeASecond}
    /></div>
    <div>Merkle Proof: <input
      type="file"
      accept="application/json"
      onChange={async e => {
        if (e.target.files === null || e.target.files.length === 0) {
          setProofFile(null);
        } else {
          setProofFile(e.target.files[0]);
        }
      }}
      disabled={gimmeASecond}
    /></div>
    <div>{showStatus(anchorStatus)}</div>
  </div>
}



function showStatus(s: AnchorStatus): React.ReactElement {
  switch (s.tag) {
    case 'posted':
      return <>Anchor Was Posted At Block {s.data}</>;
    case 'notposted':
      return <>Anchor Not Found</>;
    case 'checking':
      return <>...</>;
    case 'waiting':
      return <>Waiting for file.</>;
    case 'hashing':
      return <>Hashing file.</>;
    case 'err':
      return <span style={{ color: '#91130a' }}> {s.data}</span >;
  }
}

// read a json file to get a merkle proof, throw error if invalid or reading file fails
async function proofFromFile(proofFile: File): Promise<ProofElement<number[]>[]> {
  const proofText = await proofFile.text();
  const proofJson = JSON.parse(proofText);
  if (!Object.prototype.hasOwnProperty.call(proofJson, 'proof')) {
    throw new Error('the file provided does not contain a "proof" property');
  }
  return dehexproof(proofJson.proof);
}

// Check to see at which block a value was anchored. Return the block when the hash was
// anchored. If the value is not anchored, return null.
async function check(bs: Uint8Array, nodeConn: ApiPromise): Promise<number | null> {
  const anchor = await nodeConn.query.anchor.anchors(u8aToHex(await blake2b256(bs)));
  let opt = anchor as any;
  if (opt.isNone) {
    return null;
  } else {
    return opt.unwrap().toNumber();
  }
}

async function vproof(hash: Uint8Array, proof: ProofElement<number[]>[]): Promise<Uint8Array> {
  const { verify_proof } = await import('mrklt');
  return verify_proof(hash, proof);
}

export default React.memo(Check);
