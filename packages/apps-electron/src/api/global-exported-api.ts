// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ElectronMainApi } from './electron-main-api';

declare global {
  interface Window {
    ElectronMain: ElectronMainApi
  }
}

export const electronMainApi = window.ElectronMain;
