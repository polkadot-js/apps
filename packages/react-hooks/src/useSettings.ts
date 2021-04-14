// Copyright 2017-2021 @polkadot/app-settings authors & contributors
// and @canvas-ui/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SettingsStruct } from '@polkadot/ui-settings/types';

import { VoidFn } from '@canvas-ui/react-util/types';
import { useCallback, useEffect, useState } from 'react';

import uiSettings from '@polkadot/ui-settings';

interface UseSettings {
  isChanged: boolean | null;
  onChangeKey: (key: keyof SettingsStruct) => <T extends string | number>(value: T) => void;
  save: VoidFn;
  saveAndReload: VoidFn;
  settings: SettingsStruct;
}

function save (settings: SettingsStruct): void {
  uiSettings.set(settings);
}

function saveAndReload (settings: SettingsStruct): void {
  save(settings);

  // HACK This is terribe, but since the API needs to re-connect, but since
  // the API does not yet handle re-connections properly, it is what it is
  window.location.reload();
}

export default function useSettings (reloadOnChange?: boolean): UseSettings {
  // tri-state: null = nothing changed, false = no reload, true = reload required
  const [isChanged, setIsChanged] = useState<boolean | null>(null);
  const [settings, setSettings] = useState(uiSettings.get());

  useEffect(
    (): void => {
      const prev = uiSettings.get() as unknown as Record<string, unknown>;
      const hasChanges = Object.entries(settings).some(([key, value]) => prev[key] !== value);
      const needsReload = prev.apiUrl !== settings.apiUrl || prev.prefix !== settings.prefix;

      if (reloadOnChange && needsReload) {
        saveAndReload(settings);
      } else {
        setIsChanged(
          hasChanges
            ? needsReload
            : null
        );
      }
    },
    [reloadOnChange, settings]
  );

  const onChangeKey = useCallback(
    (key: keyof SettingsStruct) => <T extends string | number>(value: T): void =>
      setSettings((settings) => ({ ...settings, [key]: value })),
    []
  );
  const _saveAndReload = useCallback(
    (): void => saveAndReload(settings),
    [settings]
  );
  const _save = useCallback(
    (): void => {
      save(settings);
      setIsChanged(null);
    },
    [settings]
  );

  return {
    isChanged,
    onChangeKey,
    save: _save,
    saveAndReload: _saveAndReload,
    settings
  };
}
