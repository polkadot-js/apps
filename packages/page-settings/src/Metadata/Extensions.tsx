// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ChainInfo } from '../types';

import React, { useCallback, useMemo, useState } from 'react';
import { extensionLogos } from '@polkadot/apps-config/ui/logos';
import { Button, Dropdown, Spinner } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import useExtensions from '../useExtensions';
import iconOption from './iconOption';

interface Props {
  chainInfo: ChainInfo | null;
  className?: string;
}

function Extensions ({ chainInfo, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { extensions } = useExtensions();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isBusy, toggleBusy] = useToggle();
  const options = useMemo(
    () => (extensions || []).map(({ extension: { name, version } }, value) =>
      iconOption(`${name} ${version}`, value, extensionLogos[name])),
    [extensions]
  );
  const _updateMeta = useCallback(
    (): void => {
      if (chainInfo && extensions?.[selectedIndex]) {
        toggleBusy();

        extensions[selectedIndex]
          .update(chainInfo)
          .catch(() => false)
          .then(() => toggleBusy())
          .catch(console.error);
      }
    },
    [chainInfo, extensions, selectedIndex, toggleBusy]
  );

  return (
    <div className={className}>
      {extensions
        ? options.length
          ? (
            <>
              <Dropdown
                label={t<string>('upgradable extensions')}
                onChange={setSelectedIndex}
                options={options}
                value={selectedIndex}
              />
              <Button.Group>
                <Button
                  icon='upload'
                  isDisabled={isBusy}
                  label={t<string>('Update metadata')}
                  onClick={_updateMeta}
                />
              </Button.Group>
            </>
          )
          : <div>{t<string>('No upgradable extensions found')}</div>
        : <Spinner />
      }
    </div>
  );
}

export default React.memo(Extensions);
