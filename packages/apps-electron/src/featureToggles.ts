// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

function getBoolEnv (env: string | undefined, fallback: boolean) {
  return env ? (env) !== 'false' : fallback;
}

export const features = {
  autoUpdater: getBoolEnv(process.env.POLKADOT_APPS_FEATURE_AUTOUPDATER, false)
};
