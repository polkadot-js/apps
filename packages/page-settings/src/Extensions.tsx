// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback, useMemo, useState } from 'react';
import { getChainTypes } from '@polkadot/apps-config/api';
import { getSystemIcon } from '@polkadot/apps-config/ui';
import { Button, Dropdown } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from './translate';
import useExtensions from './useExtensions';

function Extensions (): React.ReactElement {
  const { api, systemChain, systemName } = useApi();
  const { t } = useTranslation();
  const { extensions } = useExtensions();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isBusy, toggleBusy] = useToggle();
  const options = useMemo(
    () => (extensions || []).map(({ extension: { name, version } }, value) => ({ text: `${name} ${version}`, value })),
    [extensions]
  );
  const _updateMeta = useCallback(
    (): void => {
      if (extensions && extensions[selectedIndex]) {
        toggleBusy();

        extensions[selectedIndex]
          .update({
            chain: systemChain,
            genesisHash: api.genesisHash.toHex(),
            icon: getSystemIcon(systemName),
            metaCalls: Buffer.from(api.runtimeMetadata.asCallsOnly.toU8a()).toString('base64'),
            specVersion: api.runtimeVersion.specVersion.toNumber(),
            ss58Format: api.registry.chainSS58 || 42,
            tokenDecimals: api.registry.chainDecimals || 12,
            tokenSymbol: api.registry.chainToken || 'Unit',
            types: getChainTypes(api.runtimeVersion.specName.toString(), systemChain)
          })
          .catch(() => false)
          .then(() => toggleBusy());
      }
    },
    [api, extensions, selectedIndex, systemChain, systemName]
  );

  if (!options.length) {
    return <div>{t('No upgradable extensions found')}</div>;
  }

  return (
    <div>
      <Dropdown
        label={t('upgradable extensions')}
        onChange={setSelectedIndex}
        options={options}
        value={selectedIndex}
      />
      <Button.Group>
        <Button
          icon='refresh'
          isDisabled={isBusy}
          label={t('Update metadata')}
          onClick={_updateMeta}
        />
      </Button.Group>
    </div>
  );
}

export default React.memo(Extensions);
