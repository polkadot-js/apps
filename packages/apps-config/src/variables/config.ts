// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

const LCURL = process.env['LCURL'] as string || 'https://kate.avail.tools'
const TESTNETURL = process.env['TESTNETURL'] as `wss://${string}` || 'wss://kate.avail.tools/ws'

const config = {
  LCURL,
  TESTNETURL
}

export default config
