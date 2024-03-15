// Copyright 2017-2024 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
// eslint-disable-next-line
const LCURL = process.env.LCURL as string || 'https://goldberg.avail.tools';
const TESTNETURL = process.env.TESTNETURL as `wss://${string}` || 'wss://goldberg.avail.tools/ws';

const config = {
  LCURL,
  TESTNETURL
};

export default config;
