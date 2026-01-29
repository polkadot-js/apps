// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ElectronMainApi } from './electron-main-api.js';

declare global {
  interface Window {
    ElectronMain: ElectronMainApi
  }
}

export const electronMainApi = window.ElectronMain;
