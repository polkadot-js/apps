// Copyright 2017-2024 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
// eslint-disable-next-line
const config: { [network: string]: { url: `wss://${string}`, lcUrl: string } } = {
  mainnet: {
    lcUrl: process.env.MAINNET_LC || 'https://api.lightclient.mainnet.avail.tools/v1',
    url: process.env.MAINNET_URL as `wss://${string}` || 'wss://mainnet-rpc.avail.so/ws'
  },
  turing: {
    lcUrl: process.env.TURING_LC || 'https://api.lightclient.turing.avail.so/v1',
    url: process.env.TURING_URL as `wss://${string}` || 'wss://turing-rpc.avail.so/ws'
  }
};

export const getLCFromUrl = (apiUrl: string) => {
  if (apiUrl.includes('turing')) {
    return config.turing.lcUrl;
  } else {
    return config.turing.lcUrl;
  }
};

export default config;
