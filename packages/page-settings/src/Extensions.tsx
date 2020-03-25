// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedMetadataKnown } from '@polkadot/extension-inject/types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Dropdown, Spinner } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { isNumber } from '@polkadot/util';

import { useTranslation } from './translate';

type Info = [boolean, InjectedMetadataKnown[]];

const EMPTY_EXT: Info = [false, []];

function Extensions (): React.ReactElement {
  const { api, isApiReady, extensions } = useApi();
  const { t } = useTranslation();
  const [chainInfos, setChainInfos] = useState<Info[] | undefined>();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const options = useMemo(
    () => extensions ? extensions.map(({ name, version }, value) => ({ text: `${name} ${version}`, value })) : [],
    [extensions]
  );
  const canUpdate = useMemo(
    (): boolean => {
      if (isApiReady && isNumber(selectedIndex) && chainInfos && chainInfos[selectedIndex][0]) {
        const chainInfo = chainInfos[selectedIndex][1].find(({ genesisHash }) => api.genesisHash.eq(genesisHash));

        return chainInfo
          ? !api.runtimeVersion.specVersion.eq(chainInfo.specVersion)
          : true;
      }

      return false;
    },
    [api, chainInfos, isApiReady, selectedIndex]
  );

  useEffect((): void => {
    extensions && Promise
      .all(extensions.map(({ metadata }): Promise<Info> =>
        metadata
          ? metadata.get()
            .then((chains): Info => [true, chains])
            .catch(() => EMPTY_EXT)
          : Promise.resolve(EMPTY_EXT)
      ))
      .then(setChainInfos);
  }, [extensions]);

  const _updateMeta = useCallback(
    (): void => {
      if (extensions && extensions[selectedIndex].metadata) {
        extensions[selectedIndex].metadata
          .provide({
            chain: 'Testing',
            genesisHash: api.genesisHash.toHex(),
            icon: 'polkadot',
            specVersion: api.runtimeVersion.specVersion.toNumber(),
            ss58Format: api.registry.chainSS58 || 42,
            tokenDecimals: api.registry.chainDecimals || 12,
            tokenSymbol: api.registry.chainToken || 'Unit',
            types: {}
          });
      }
    },
    [extensions, selectedIndex]
  );

  if (!extensions) {
    return <Spinner />;
  }

  return (
    <div>
      <Dropdown
        label={t('available extensions')}
        onChange={setSelectedIndex}
        options={options}
        value={selectedIndex}
      />
      <Button.Group>
        <Button
          icon='refresh'
          isDisabled={!canUpdate}
          label={t('Update metadata')}
          onClick={_updateMeta}
        />
      </Button.Group>
    </div>
  );
}

export default React.memo(Extensions);
