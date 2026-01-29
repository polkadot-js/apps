// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';

import { createNamedHook } from './createNamedHook.js';

const KNOWN = ['ipfs', 'ipns'];
const SECTIONS = KNOWN.map((part) => `/${part}/`);
const LOCAL_IPFS = '.ipfs.localhost';
const LOCAL_IPNS = '.ipns.localhost';

interface State {
  ipnsChain: string | null;
  ipnsDomain: string | null;
  ipfsHash: string | null;
  ipfsPath: string | null;
  isIpfs: boolean;
  isIpns: boolean;
}

function extractLocalIpfs (url: string): State {
  const [,, _ipfsPath] = url.split('/');
  const ipfsPath = _ipfsPath.split(':')[0];

  return {
    ipfsHash: ipfsPath.replace(LOCAL_IPFS, ''),
    ipfsPath,
    ipnsChain: null,
    ipnsDomain: null,
    isIpfs: true,
    isIpns: false
  };
}

function extractLocalIpns (url: string): State {
  const [,, _ipfsPath] = url.split('/');
  const ipfsPath = _ipfsPath.split(':')[0];

  const dnsLink = ipfsPath.replace(LOCAL_IPNS, '');
  const linkParts = dnsLink.split('.');
  let ipnsChain: string | null = null;
  let ipnsDomain: string | null = null;

  if (linkParts.length > 2) {
    ipnsChain = linkParts[0];
    ipnsDomain = linkParts.slice(1).join('.');
  } else {
    ipnsDomain = dnsLink;
  }

  return {
    ipfsHash: null,
    ipfsPath,
    ipnsChain,
    ipnsDomain,
    isIpfs: true,
    isIpns: true
  };
}

function extractOther (url: string): State {
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

export function extractIpfsDetails (): State {
  // get url and check to see if we are ipfs/ipns
  const [url] = window.location.href.split('#');

  return url.includes(LOCAL_IPFS)
    ? extractLocalIpfs(url)
    : url.includes(LOCAL_IPNS)
      ? extractLocalIpns(url)
      : extractOther(url);
}

function useIpfsImpl (): State {
  const [state] = useState(() => extractIpfsDetails());

  return state;
}

export const useIpfs = createNamedHook('useIpfs', useIpfsImpl);
