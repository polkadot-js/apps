// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from './types';

function createDev (t: (key: string, text: string, options: { ns: string }) => string): Option[] {
  return [
    {
      info: 'local',
      text: t('rpc.local', 'Local Node (Own, 127.0.0.1:9944)', { ns: 'apps-config' }),
      value: 'ws://127.0.0.1:9944/'
    }
  ];
}

function createLive (t: (key: string, text: string, options: { ns: string }) => string): Option[] {
  return [];
}

function createTest (t: (key: string, text: string, options: { ns: string }) => string): Option[] {
  return [
    {
      info: 'amber',
      text: t('rpc.amber', 'Centrifuge Testnet Amber (Full Node, hosted by Centrifuge)', { ns: 'apps-config' }),
      value: 'wss://fullnode.amber.centrifuge.io'
    },
    {
      info: 'flint',
      text: t('rpc.flint', 'Centrifuge Testnet Flint (Full Node, hosted by Centrifuge)', { ns: 'apps-config' }),
      value: 'wss://fullnode.flint.centrifuge.io'
    },
    {
      info: 'fulvous',
      text: t('rpc.fulvous', 'Centrifuge Testnet Fulvous (Validator 0, hosted by Centrifuge)', { ns: 'apps-config' }),
      value: 'wss://fullnode.fulvous.centrifuge.io'
    }
  ];
}

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../logos, specifically in namedLogos
//   text: The text to display on teh dropdown
//   value: The actual hosted secure websocket endpoint
export default function create (t: (key: string, text: string, options: { ns: string }) => string): Option[] {
  const ENV: Option[] = [];
  const WS_URL = process.env.WS_URL || (window as any).process_env?.WS_URL;

  if (WS_URL) {
    ENV.push({
      info: 'WS_URL',
      text: 'WS_URL: ' + WS_URL,
      value: WS_URL
    });
  }

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
