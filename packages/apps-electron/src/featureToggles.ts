// Copyright 2017-2020 @canvas-ui/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

function getBoolEnv (env: string | undefined, fallback: boolean) {
  return env ? (env) !== 'false' : fallback;
}

export const features = {
  autoUpdater: getBoolEnv(process.env.POLKADOT_APPS_FEATURE_AUTOUPDATER, false)
};
