// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ElectronMainApi } from './electron-main-api';

declare global {
  interface Window {
    ElectronMain: ElectronMainApi
  }
}

export const electronMainApi = window.ElectronMain;
