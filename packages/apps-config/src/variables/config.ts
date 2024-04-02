// Copyright 2017-2024 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
// eslint-disable-next-line
const config: { [network: string]: { url: `wss://${string}`, lcUrl: string } } = {
  turing: {
    lcUrl: process.env.TURING_LC || 'https://turing.avail.so',
    url: process.env.TURING_URL as `wss://${string}` || 'wss://temp-rpc-turing.avail.so/rpc'
  },
  goldberg: {
    lcUrl: process.env.GOLDBERG_LC || 'https://api.lightclient.goldberg.avail.tools/v1',
    url: process.env.GOLDBERG_URL as `wss://${string}` || 'wss://goldberg.avail.tools/ws'
  },
  // mainnet: {
  //   url: process.env.MAINNET_URL as `wss://${string}` || '',
  //   lcUrl: process.env.MAINNET_LC as string || '',
  // }
};

export const getLCFromUrl = (apiUrl: string) => {
  if (apiUrl.includes("turing")) {
    return config.turing.lcUrl
  } else if (apiUrl.includes("goldberg")) {
    return config.goldberg.lcUrl
  } else {
    return config.turing.lcUrl // CHANGE TO MAINNET
  }
};

export default config;
