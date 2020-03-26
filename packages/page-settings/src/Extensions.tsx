// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback, useMemo, useState } from 'react';
import { Button, Dropdown } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from './translate';
import useExtensions from './useExtensions';

function Extensions (): React.ReactElement {
  const { api, systemChain } = useApi();
  const { t } = useTranslation();
  const extensions = useExtensions();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isBusy, toggleBusy] = useToggle();
  const options = useMemo(
    () => extensions ? extensions.map(({ extension: { name, version } }, value) => ({ text: `${name} ${version}`, value })) : [],
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
            icon: 'polkadot',
            specVersion: api.runtimeVersion.specVersion.toNumber(),
            ss58Format: api.registry.chainSS58 || 42,
            tokenDecimals: api.registry.chainDecimals || 12,
            tokenSymbol: api.registry.chainToken || 'Unit',
            types: {}
          })
          .catch(() => false)
          .then(() => toggleBusy());
      }
    },
    [extensions, selectedIndex, systemChain]
  );

  if (!options.length) {
    return <div>{t('No upgradable extensions found')}</div>;
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
          isDisabled={isBusy}
          label={t('Update metadata')}
          onClick={_updateMeta}
        />
      </Button.Group>
    </div>
  );
}

export default React.memo(Extensions);
