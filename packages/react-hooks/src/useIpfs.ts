// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useState } from 'react';

const KNOWN = ['ipfs', 'ipns'];
const SECTIONS = KNOWN.map((part) => `/${part}/`);

interface State {
  ipnsChain: string | null;
  ipnsDomain: string | null;
  ipfsHash: string | null;
  ipfsPath: string | null;
  isIpfs: boolean;
  isIpns: boolean;
}

export function extractIpfsDetails (): State {
  // get url and check to see if we are ipfs/ipns
  const [url] = window.location.href.split('#');
  const isIpfs = SECTIONS.some((part) => url.includes(part));
  const isIpns = url.includes(SECTIONS[1]);

  // individual sections, with the index of the ipfs portion
  const urlParts = url.split('/');
  const index = urlParts.indexOf(isIpns ? KNOWN[1] : KNOWN[0]);

  // the parts of the path for ipfs re-construction
  let ipfsHash: string | null = null;
  let ipfsPath: string | null = null;
  let ipnsChain: string | null = null;
  let ipnsDomain: string | null = null;

  // setup the ipfs part and dnslink domain (if available)
  if (index !== -1) {
    ipfsPath = urlParts.slice(0, index + 1).join('/');

    if (isIpns) {
      const dnsLink = urlParts[index + 1];
      const linkParts = dnsLink.split('.');

      if (linkParts.length > 2) {
        ipnsChain = linkParts[0];
        ipnsDomain = linkParts.slice(1).join('.');
      } else {
        ipnsDomain = dnsLink;
      }
    } else {
      ipfsHash = urlParts[index + 1];
    }
  }

  return {
    ipfsHash,
    ipfsPath,
    ipnsChain,
    ipnsDomain,
    isIpfs,
    isIpns
  };
}

export default function useIpfs (): State {
  const [state] = useState(extractIpfsDetails());

  return state;
}
