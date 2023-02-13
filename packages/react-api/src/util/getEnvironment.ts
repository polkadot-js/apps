// Copyright 2017-2023 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Environment } from '../types';

import { prodChains, prodParasKusama, prodParasKusamaCommon, prodParasPolkadot, prodParasPolkadotCommon } from '@polkadot/apps-config/endpoints/production';
import { testChains, testParasRococo, testParasRococoCommon, testParasWestend, testParasWestendCommon } from '@polkadot/apps-config/endpoints/testing';

// https://github.com/electron/electron/issues/2288
function isElectron () {
  if (process?.versions?.electron) {
    return true;
  }

  if (window?.process?.type === 'renderer') {
    return true;
  }

  return navigator?.userAgent?.indexOf('Electron') >= 0;
}

export default function getEnvironment (): Environment {
  if (isElectron()) {
    return 'app';
  }

  return 'web';
}

const API_URL = 'apiUrl';

export const rpcNetwork = {
  isDarwinia: (): boolean => {
    const apiUrl = localStorage.getItem(API_URL);

    if (!apiUrl) {
      return false;
    }

    const darwiniaTerms = ['crab', 'darwinia', 'pangolin', 'pangoro'];
    const darwiniaUrls: string[] = [];
    const combinedChains = [
      ...prodChains,
      ...prodParasKusama,
      ...prodParasKusamaCommon,
      ...prodParasPolkadot,
      ...prodParasPolkadotCommon,
      ...testChains,
      ...testParasRococoCommon,
      ...testParasWestend,
      ...testParasWestendCommon,
      ...testParasRococo
    ];

    combinedChains.forEach((endPoint) => {
      if (!endPoint.info) {
        return;
      }

      const info = endPoint.info.toLowerCase();

      if (darwiniaTerms.includes(info)) {
        Object.values(endPoint.providers).forEach((apiUrl) => {
          darwiniaUrls.push(apiUrl);
        });
      }
    });

    return darwiniaUrls.includes(apiUrl);
  },
  setApiUrl: (url: string) => {
    localStorage.setItem(API_URL, url);
  }
};
