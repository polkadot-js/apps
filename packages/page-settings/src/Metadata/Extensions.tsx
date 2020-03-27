// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback, useMemo, useState } from 'react';
import { Button, Dropdown } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import useChainInfo from '../useChainInfo';
import useExtensions from '../useExtensions';

function Extensions (): React.ReactElement {
  const { t } = useTranslation();
  const metaDef = useChainInfo();
  const { extensions } = useExtensions();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isBusy, toggleBusy] = useToggle();
  const options = useMemo(
    () => (extensions || []).map(({ extension: { name, version } }, value) => ({ text: `${name} ${version}`, value })),
    [extensions]
  );
  const _updateMeta = useCallback(
    (): void => {
      if (metaDef && extensions?.[selectedIndex]) {
        toggleBusy();

        extensions[selectedIndex]
          .update(metaDef)
          .catch(() => false)
          .then(() => toggleBusy());
      }
    },
    [extensions, metaDef, selectedIndex]
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
