// Copyright 2017-2024 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
// eslint-disable-next-line
const config: { [network: string]: { url: `wss://${string}`, lcUrl: string } } = {
  turing: {
    lcUrl: process.env.TURING_LC || 'https://turing.avail.so',
    url: process.env.TURING_URL as `wss://${string}` || 'wss://temp-rpc-turing.avail.so/rpc'
  }
  // mainnet: {
  //   url: process.env.MAINNET_URL as `wss://${string}` || 'wss://rpc-hex-devnet.avail.tools/ws',
  //   lcUrl: process.env.MAINNET_LC as string || 'https://rpc-hex-devnet.avail.tools',
  // }
};

export const getLCFromUrl = (_apiUrl: string) => {
  return config.turing.lcUrl;
  // if (apiUrl.includes("turing")) {
  //   return config.turing.lcUrl
  // } else {
  //   return config.mainnet.lcUrl
  // }
};

export default config;
