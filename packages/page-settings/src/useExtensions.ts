// Copyright 2017-2021 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { InjectedExtension, InjectedMetadataKnown, MetadataDef } from '@polkadot/extension-inject/types';

import { useEffect, useMemo, useState } from 'react';
import store from 'store';

import { useApi } from '@polkadot/react-hooks';

interface ExtensionKnown {
  extension: InjectedExtension;
  known: InjectedMetadataKnown[];
  update: (def: MetadataDef) => Promise<boolean>;
}

interface ExtensionInfo extends ExtensionKnown {
  current: InjectedMetadataKnown | null;
}

interface Extensions {
  count: number;
  extensions: ExtensionInfo[];
}

interface ExtensionProperties {
  extensionVersion: string;
  tokenDecimals: number;
  tokenSymbol: string;
  ss58Format?: number;
}

interface SavedProperties {
  [name: string]: ExtensionProperties;
}

type TriggerFn = (counter: number) => void;

let triggerCount = 0;
const triggers = new Map<string, TriggerFn>();

function triggerAll (): void {
  [...triggers.values()].forEach((trigger) => trigger(Date.now()));
}

// save the properties for a specific extension
function saveProperties (api: ApiPromise, { name, version }: InjectedExtension): void {
  const storeKey = `properties:${api.genesisHash.toHex()}`;
  const allProperties = store.get(storeKey, {}) as SavedProperties;

  allProperties[name] = {
    extensionVersion: version,
    ss58Format: api.registry.chainSS58,
    tokenDecimals: api.registry.chainDecimals[0],
    tokenSymbol: api.registry.chainTokens[0]
  };

  store.set(storeKey, allProperties);
}

// determines if the extension has current properties
function hasCurrentProperties (api: ApiPromise, { extension }: ExtensionKnown): boolean {
  const allProperties = store.get(`properties:${api.genesisHash.toHex()}`, {}) as SavedProperties;

  // when we don't have properties yet, assume nothing has changed and store
  if (!allProperties[extension.name]) {
    saveProperties(api, extension);

    return true;
  }

  const { ss58Format, tokenDecimals, tokenSymbol } = allProperties[extension.name];

  return ss58Format === api.registry.chainSS58 &&
    tokenDecimals === api.registry.chainDecimals[0] &&
    tokenSymbol === api.registry.chainTokens[0];
}

// filter extensions based on the properties we have available
function filterAll (api: ApiPromise, all: ExtensionKnown[]): Extensions {
  const extensions = all
    .map((info): ExtensionInfo | null => {
      const current = info.known.find(({ genesisHash }) => api.genesisHash.eq(genesisHash)) || null;

      // if we cannot find it as known, or either the specVersion or properties mismatches, mark it as upgradable
      return !current || api.runtimeVersion.specVersion.gtn(current.specVersion) || !hasCurrentProperties(api, info)
        ? { ...info, current }
        : null;
    })
    .filter((info): info is ExtensionInfo => !!info);

  return {
    count: extensions.length,
    extensions
  };
}

async function getExtensionInfo (api: ApiPromise, extension: InjectedExtension): Promise<ExtensionKnown | null> {
  if (!extension.metadata) {
    return null;
  }

  try {
    const metadata = extension.metadata;
    const known = await metadata.get();

    return {
      extension,
      known,
      update: async (def: MetadataDef): Promise<boolean> => {
        let isOk = false;

        try {
          isOk = await metadata.provide(def);

          if (isOk) {
            saveProperties(api, extension);
            triggerAll();
          }
        } catch (error) {
          // ignore
        }

        return isOk;
      }
    };
  } catch (error) {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getKnown (api: ApiPromise, extensions: InjectedExtension[], _: number): Promise<ExtensionKnown[]> {
  const all = await Promise.all(
    extensions.map((extension) => getExtensionInfo(api, extension))
  );

  return all.filter((info): info is ExtensionKnown => !!info);
}

const EMPTY_STATE = { count: 0, extensions: [] };

export default function useExtensions (): Extensions {
  const { api, extensions, isApiReady, isDevelopment } = useApi();
  const [all, setAll] = useState<ExtensionKnown[] | undefined>();
  const [trigger, setTrigger] = useState(0);

  useEffect((): () => void => {
    const myId = `${++triggerCount}-${Date.now()}`;

    triggers.set(myId, setTrigger);

    return (): void => {
      triggers.delete(myId);
    };
  }, []);

  useEffect((): void => {
    extensions && getKnown(api, extensions, trigger).then(setAll);
  }, [api, extensions, trigger]);

  return useMemo(
    () => isDevelopment || !isApiReady || !all
      ? EMPTY_STATE
      : filterAll(api, all),
    [all, api, isApiReady, isDevelopment]
  );
}
