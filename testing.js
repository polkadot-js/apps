// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const KNOWN = ['ipfs', 'ipns'];
const SECTIONS = KNOWN.map((part) => `/${part}/`);

function createDev (t) {
  return [
    {
      info: 'local',
      text: t('rpc.local', 'Local Node (Own, 127.0.0.1:9944)', { ns: 'apps-config' }),
      value: 'ws://127.0.0.1:9944/'
    }
  ];
}

function createLive (t) {
  return [
    {
      dnslink: 'polkadot',
      info: 'polkadot',
      text: t('rpc.polkadot.parity', 'Polkadot (Live, hosted by Parity)', { ns: 'apps-config' }),
      value: 'wss://rpc.polkadot.io'
    },
    {
      dnslink: 'polkadot',
      info: 'polkadot',
      text: t('rpc.polkadot.w3f', 'Polkadot (Live, hosted by Web3 Foundation)', { ns: 'apps-config' }),
      value: 'wss://cc1-1.polkadot.network'
    },
    {
      dnslink: 'kusama',
      info: 'kusama',
      text: t('rpc.kusama.parity', 'Kusama (Polkadot Canary, hosted by Parity)', { ns: 'apps-config' }),
      value: 'wss://kusama-rpc.polkadot.io/'
    },
    {
      dnslink: 'kusama',
      info: 'kusama',
      text: t('rpc.kusama.w3f', 'Kusama (Polkadot Canary, hosted by Web3 Foundation)', { ns: 'apps-config' }),
      value: 'wss://cc3-5.kusama.network/'
    },
    {
      dnslink: 'kusama',
      info: 'kusama',
      text: t('rpc.kusama.ava', 'Kusama (Polkadot Canary, user-run public nodes; see https://status.cloud.ava.do/)', { ns: 'apps-config' }),
      value: 'wss://kusama.polkadot.cloud.ava.do/'
    },
    {
      dnslink: 'edgeware',
      info: 'edgeware',
      text: t('rpc.edgeware', 'Edgeware (Edgeware Mainnet, hosted by Commonwealth Labs)', { ns: 'apps-config' }),
      value: 'wss://mainnet1.edgewa.re'
    },
    {
      dnslink: 'kulupu',
      info: 'substrate',
      text: t('rpc.kulupu', 'Kulupu (Kulupu Mainnet, hosted by Kulupu)', { ns: 'apps-config' }),
      value: 'wss://rpc.kulupu.network/ws'
    }
  ];
}

function createTest (t) {
  return [
    {
      dnslink: 'westend',
      info: 'westend',
      text: t('rpc.westend', 'Westend (Polkadot Testnet, hosted by Parity)', { ns: 'apps-config' }),
      value: 'wss://westend-rpc.polkadot.io'
    },
    {
      info: 'edgeware',
      text: t('rpc.berlin', 'Berlin (Edgeware Testnet, hosted by Commonwealth Labs)', { ns: 'apps-config' }),
      value: 'wss://berlin1.edgewa.re'
    },
    {
      info: 'substrate',
      text: t('rpc.flamingfir', 'Flaming Fir (Substrate Testnet, hosted by Parity)', { ns: 'apps-config' }),
      value: 'wss://substrate-rpc.parity.io/'
    },
    {
      info: 'nodle',
      text: t('rpc.arcadia', 'Arcadia (Nodle Testnet, hosted by Nodle)', { ns: 'apps-config' }),
      value: 'wss://arcadia1.nodleprotocol.io/'
    }
  ];
}

function createEndpoints (t) {
  const ENV = [];
  let endpoints = [
    {
      isHeader: true,
      text: t('rpc.header.live', 'Live networks', { ns: 'apps-config' }),
      value: ''
    },
    ...createLive(t),
    {
      isHeader: true,
      text: t('rpc.header.test', 'Test networks', { ns: 'apps-config' }),
      value: ''
    },
    ...createTest(t),
    {
      isHeader: true,
      text: t('rpc.header.dev', 'Development', { ns: 'apps-config' }),
      value: ''
    },
    ...createDev(t)
  ];

  if (ENV.length > 0) {
    endpoints = [
      {
        isHeader: true,
        text: t('rpc.custom', 'Custom environment', { ns: 'apps-config' }),
        value: ''
      },
      ...ENV
    ].concat(endpoints);
  }

  return endpoints;
}

function extractIpfsDetails () {
  // get url and check to see if we are ipfs/ipns
  const [url] = window.location.href.split('#');
  const isIpfs = SECTIONS.some((part) => url.includes(part));
  const isIpns = url.includes(SECTIONS[1]);

  // individual sections, with the index of the ipfs portion
  const urlParts = url.split('/');
  const index = urlParts.indexOf(isIpns ? KNOWN[1] : KNOWN[0]);

  // the parts of the path for ipfs re-construction
  let ipfsHash = null;
  let ipfsPath = null;
  let ipnsChain = null;
  let ipnsDomain = null;

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

function getApiUrl () {
  const endpoints = createEndpoints(() => '');
  const { ipnsChain } = extractIpfsDetails();

  // check against ipns domains (could be expanded to others)
  if (ipnsChain) {
    const option = endpoints.find(({ dnslink }) => dnslink === ipnsChain);

    if (option) {
      return option.value;
    }
  }

  return 'not found';
}

console.log(getApiUrl());
