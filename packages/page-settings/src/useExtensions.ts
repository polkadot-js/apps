// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedExtension, InjectedMetadataKnown, MetadataDef } from '@polkadot/extension-inject/types';

import { useEffect, useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { useApi } from '@polkadot/react-hooks';

interface ExtensionKnown {
  extension: InjectedExtension;
  known: InjectedMetadataKnown[];
  update: (def: MetadataDef) => Promise<boolean>;
}

interface ExtensionInfo extends ExtensionKnown {
  current: InjectedMetadataKnown | null;
}

async function getExtensionInfo (extension: InjectedExtension, trigger: () => void): Promise<ExtensionKnown | null> {
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
        let result = false;

        try {
          result = await metadata.provide(def);

          trigger();
        } catch (error) {
          // ignore
        }

        return result;
      }
    };
  } catch (error) {
    return null;
  }
}

async function getKnown (extensions: InjectedExtension[], trigger: () => void): Promise<ExtensionKnown[]> {
  const all = await Promise.all(
    extensions.map((extension) =>
      getExtensionInfo(extension, trigger)
    )
  );

  return all.filter((info): info is ExtensionKnown => !!info);
}

function filterAll (api: ApiPromise, all: ExtensionKnown[]): ExtensionInfo[] {
  return all
    .map((info): ExtensionInfo | null => {
      const current = info.known.find(({ genesisHash }) => api.genesisHash.eq(genesisHash)) || null;
      const isUpgradable = !current || api.runtimeVersion.specVersion.gtn(current.specVersion);

      return isUpgradable
        ? { ...info, current }
        : null;
    })
    .filter((info): info is ExtensionInfo => !!info);
}

export default function useExtensions (): ExtensionInfo[] | undefined {
  const { api, isApiReady, isDevelopment, extensions } = useApi();
  const [all, setAll] = useState<ExtensionKnown[] | undefined>();
  const [state, setState] = useState<ExtensionInfo[] | undefined>();
  const [trigger, setTrigger] = useState(0);

  useEffect((): void => {
    extensions && getKnown(extensions, () => setTrigger(Date.now())).then(setAll);
  }, [extensions, trigger]);

  useEffect((): void => {
    isApiReady && !isDevelopment && all && setState(
      filterAll(api, all)
    );
  }, [all, api, isApiReady, isDevelopment]);

  return state;
}
