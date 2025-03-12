// Copyright 2017-2025 @polkadot/app-addresses authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Button, FilterInput, styled, SummaryBox, Table } from '@polkadot/react-components';
import { useAddresses, useFavorites, useNextTick, useToggle } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';

import CreateModal from '../modals/Create.js';
import { useTranslation } from '../translate.js';
import Address from './Address.js';

interface SortedAddress { address: string; isFavorite: boolean, isVisible: boolean }

interface Props {
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
}

type FunInputFile = (e: React.ChangeEvent<HTMLInputElement>) => void

const STORE_FAVS = 'accounts:favorites';

function Overview ({ className = '', onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAddresses } = useAddresses();
  const [isCreateOpen, toggleCreate] = useToggle(false);
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [sortedAddresses, setSortedAddresses] = useState<SortedAddress[] | undefined>();
  const [filterOn, setFilter] = useState<string>('');
  const isNextTick = useNextTick();
  const importInputRef = useRef<HTMLInputElement>(null);

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('contacts'), 'start', 4]
  ]);

  useEffect((): void => {
    setSortedAddresses(
      allAddresses
        .map((address): SortedAddress => ({ address, isFavorite: favorites.includes(address), isVisible: true }))
        .sort((a, b): number =>
          a.isFavorite === b.isFavorite
            ? 0
            : b.isFavorite
              ? 1
              : -1
        )
    );
  }, [allAddresses, favorites]);

  const toggleVisible = useCallback((address: string, isVisible: boolean) => {
    setSortedAddresses((account) => account
      ?.map((e) => e.address === address ? { ...e, isVisible } : e)
      .sort((a, b) => a.isVisible === b.isVisible ? 0 : b.isVisible ? 1 : -1)
    );
  }, []);

  const onImport = useCallback(() => {
    if (!importInputRef.current) {
      return;
    }

    importInputRef.current.click();
  }, []);

  const _onInputImportFile = useCallback<FunInputFile>((e) => {
    try {
      // _onImportResult(t('Importing'));
      const fileReader = new FileReader();
      const files = e.target.files;

      if (!files) {
        return;
      }

      fileReader.readAsText(files[0], 'UTF-8');

      // if (!(/(.json)$/i.test(e.target.value))) {
      //   return _onImportResult(t('file error'), 'error');
      // }

      // fileReader.onload = (e) => {
      //   const _list = JSON.parse(e.target?.result as string) as SaveFile[];

      //   if (!Array.isArray(_list)) {
      //     return _onImportResult(t('file content error'), 'error');
      //   }

      //   const fitter: SaveFile[] = [];
      //   const mapImport: Record<string, boolean> = {};

      //   for (const item of _list) {
      //     if (item.Hash && item.Name && item.UpEndpoint && item.PinEndpoint) {
      //       fitter.push(item);
      //       mapImport[item.Hash] = true;
      //     }
      //   }

      //   const filterOld = wFiles.files.filter((item) => !mapImport[item.Hash]);

      //   wFiles.setFiles([...fitter, ...filterOld]);
      //   _onImportResult(t('Import Success'), 'success');
      // };
    } catch {
      // _onImportResult(t('file content error'), 'error');
    }
  }, []);

  const onExport = useCallback(() => {
    const accounts = sortedAddresses?.map(({ address, isFavorite }) => {
      const account = keyring.getAddress(address);

      return { address, isFavorite, name: account?.meta.name || address };
    });

    /** **************** Export accounts as JSON ******************/

    const jsonData = JSON.stringify(accounts, null, 2); // Pretty-print JSON
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;
    a.download = `batch_exported_address_book_${new Date().getTime()}.json`; // File name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url); // Clean up

    /** ********************* ************** ************************/
  }, [sortedAddresses]);

  return (
    <StyledDiv className={className}>
      <input
        accept='application/json'
        onChange={_onInputImportFile}
        ref={importInputRef}
        style={{ display: 'none' }}
        type={'file'}
      />
      {isCreateOpen && (
        <CreateModal
          onClose={toggleCreate}
          onStatusChange={onStatusChange}
        />
      )}
      <SummaryBox className='summary-box-contacts'>
        <section>
          <FilterInput
            className='media--1000'
            filterOn={filterOn}
            label={t('filter by name or tags')}
            setFilter={setFilter}
          />
        </section>
        <Button.Group>
          <Button
            icon='file-import'
            label={t('Import')}
            onClick={onImport}
          />
          {!!sortedAddresses?.length &&
            (
              <Button
                icon='file-export'
                label={t('Export')}
                onClick={onExport}
              />
            )
          }
          <Button
            icon='plus'
            label={t('Add contact')}
            onClick={toggleCreate}
          />
        </Button.Group>
      </SummaryBox>
      <Table
        empty={isNextTick && sortedAddresses && t('no addresses saved yet, add any existing address')}
        header={headerRef.current}
        isSplit
      >
        {isNextTick && sortedAddresses?.map(({ address, isFavorite, isVisible }): React.ReactNode => (
          <Address
            address={address}
            filter={filterOn}
            isFavorite={isFavorite}
            isVisible={isVisible}
            key={address}
            toggleFavorite={toggleFavorite}
            toggleVisible={toggleVisible}
          />
        ))}
      </Table>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  .summary-box-contacts {
    align-items: center;
  }
`;

export default React.memo(Overview);
