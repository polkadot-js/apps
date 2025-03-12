// Copyright 2017-2025 @polkadot/app-addresses authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus, ActionStatusBase } from '@polkadot/react-components/Status/types';
import type { FunInputFile, SaveFile, SortedAddress } from './types.js';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Button, FilterInput, styled, SummaryBox, Table } from '@polkadot/react-components';
import { useAddresses, useFavorites, useNextTick, useQueue, useToggle } from '@polkadot/react-hooks';

import CreateModal from '../modals/Create.js';
import { useTranslation } from '../translate.js';
import Address from './Address.js';
import Export from './Export.jsx';

interface Props {
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
}

const STORE_FAVS = 'accounts:favorites';

function Overview ({ className = '', onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { queueAction } = useQueue();
  const [files, setFiles] = useState<SaveFile[]>([]);
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

  const _onImportResult = useCallback<(m: string, s?: ActionStatusBase['status']) => void>(
    (message, status = 'queued') => {
      queueAction?.({
        action: t('Import file'),
        message,
        status
      });
    },
  [queueAction, t]
  );

  const onImport = useCallback(() => {
    if (!importInputRef.current) {
      return;
    }

    importInputRef.current.click();
  }, []);

  const _onInputImportFile = useCallback<FunInputFile>((e) => {
    try {
      const fileReader = new FileReader();
      const files = e.target.files;

      if (!files) {
        return _onImportResult(t('no file choosen'), 'error');
      }

      fileReader.readAsText(files[0], 'UTF-8');

      if (!(/(.json)$/i.test(e.target.value))) {
        return _onImportResult(t('file error'), 'error');
      }

      fileReader.onload = (e) => {
        const _list = JSON.parse(e.target?.result as string) as SaveFile[];

        if (!Array.isArray(_list)) {
          return _onImportResult(t('file content error'), 'error');
        }

        const fitter: SaveFile[] = [];

        for (const item of _list) {
          if (item.name && item.address) {
            fitter.push(item);
          }
        }

        setFiles(fitter);

        _onImportResult(t('Import Success'), 'success');
      };
    } catch {
      _onImportResult(t('file content error'), 'error');
    }
  }, [_onImportResult, t]);

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
          <Export sortedAddresses={sortedAddresses} />
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
