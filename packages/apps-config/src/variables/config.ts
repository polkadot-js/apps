// Copyright 2017-2024 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
// eslint-disable-next-line
const config: { [network: string]: { url: `wss://${string}`, lcUrl: string } } = {
  mainnet: {
    lcUrl: process.env.MAINNET_LC || 'https://rpc-hex-devnet.avail.tools',
    url: process.env.MAINNET_URL as `wss://${string}` || 'wss://rpc-hex-devnet.avail.tools/ws'
  },
  turing: {
    lcUrl: process.env.TURING_LC || 'https://turing.avail.so',
    url: process.env.TURING_URL as `wss://${string}` || 'wss://turing.avail.so/ws'
  }
};

export const getLCFromUrl = (apiUrl: string) => {
  if (apiUrl.includes('turing')) {
    return config.turing.lcUrl;
  } else {
    return config.mainnet.lcUrl;
  }
};

export default config;
