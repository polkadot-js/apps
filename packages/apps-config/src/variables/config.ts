// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

const LCURL = process.env.LCURL as string || 'https://goldberg.avail.tools';
const TESTNETURL = process.env.TESTNETURL as `wss://${string}` || 'wss://goldberg.avail.tools/ws';

const config = {
  LCURL,
  TESTNETURL
};

export default config;
