// Copyright 2017-2025 @polkadot/app-addresses authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SortedAddress } from './types.js';

import FileSaver from 'file-saver';
import React, { useCallback } from 'react';

import { Button } from '@polkadot/react-components';
import { keyring } from '@polkadot/ui-keyring';

import { useTranslation } from '../translate.js';

interface Props {
  sortedAddresses?: SortedAddress[]
}

function Export ({ sortedAddresses }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const onExport = useCallback(() => {
    const accounts = sortedAddresses?.map(({ address, isFavorite }) => {
      const account = keyring.getAddress(address); // get account info

      return { address, isFavorite, name: account?.meta.name || address };
    });

    /** **************** Export accounts as JSON ******************/

    const blob = new Blob([JSON.stringify(accounts, null, 2)], { type: 'application/json; charset=utf-8' });

    // eslint-disable-next-line deprecation/deprecation
    FileSaver.saveAs(blob, `batch_exported_address_book_${new Date().getTime()}.json`);

    /** ********************* ************** ************************/
  }, [sortedAddresses]);

  return sortedAddresses?.length
    ? (
      <Button
        icon='file-export'
        label={t('Export')}
        onClick={onExport}
      />
    )
    : <></>;
}

export default React.memo(Export);
