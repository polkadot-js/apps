// Copyright 2017-2021 @polkadot/app-settings authors & contributors
// and @canvas-ui/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SettingsStruct } from '@polkadot/ui-settings/types';

import uiSettings from '@polkadot/ui-settings';

export function save (settings: SettingsStruct): void {
  uiSettings.set(settings);
}

