// Copyright 2017-2025 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { MetadataDef } from '@polkadot/extension-inject/types';
import type { HexString } from '@polkadot/util/types';
import type { ChainInfo } from '../types.js';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { knownExtensions } from '@polkadot/apps-config';
import { externalEmptySVG } from '@polkadot/apps-config/ui/logos/external';
import { Button, Dropdown, Spinner, styled, Table } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { objectSpread } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import useExtensions from '../useExtensions.js';
import iconOption from './iconOption.js';

interface Props {
  chainInfo: ChainInfo | null;
  className?: string;
  rawMetadata: HexString | null;
}

function Extensions ({ chainInfo, className, rawMetadata }: Props): React.ReactElement<Props> {
  const isMetadataReady = rawMetadata !== null;

  const { t } = useTranslation();
  const { extensions } = useExtensions();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isBusy, toggleBusy] = useToggle(true);

  useEffect((): void => {
    if (isMetadataReady) {
      toggleBusy();
    }
  }, [isMetadataReady, toggleBusy]);

  const options = useMemo(
    () => (extensions || []).map(({ extension: { name, version } }, value) =>
      iconOption(`${name} ${version}`, value, knownExtensions[name]?.ui.logo || externalEmptySVG)
    ),
    [extensions]
  );

  const _updateMeta = useCallback(
    (): void => {
      if (chainInfo && extensions?.[selectedIndex]) {
        toggleBusy();

        const rawDef: MetadataDef = objectSpread<MetadataDef>({}, { ...chainInfo, rawMetadata });

        extensions[selectedIndex]
          .update(rawDef)
          .catch(() => false)
          .then(() => toggleBusy())
          .catch(console.error);
      }
    },
    [chainInfo, extensions, rawMetadata, selectedIndex, toggleBusy]
  );

  const headerRef = useRef<[React.ReactNode?, string?, number?][]>([
    [t('Extensions'), 'start']
  ]);

  return (
    <StyledTable
      className={className}
      empty={t('No Upgradable extensions')}
      header={headerRef.current}
    >
      {extensions
        ? options.length !== 0 && (
          <>
            <tr className='isExpanded isFirst'>
              <td>
                <Dropdown
                  label={t('upgradable extensions')}
                  onChange={setSelectedIndex}
                  options={options}
                  value={selectedIndex}
                />
              </td>
            </tr>
            <tr className='isExpanded isLast'>
              <td>
                <Button.Group>
                  <Button
                    icon='upload'
                    isDisabled={isBusy}
                    label={t('Update metadata')}
                    onClick={_updateMeta}
                  />
                </Button.Group>
              </td>
            </tr>
          </>
        )
        : <Spinner />
      }
    </StyledTable>
  );
}

const StyledTable = styled(Table)`
  table {
    overflow: visible;
    z-index: 2;
  }
`;

export default React.memo(Extensions);
