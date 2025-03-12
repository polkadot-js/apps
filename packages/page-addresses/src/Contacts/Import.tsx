// Copyright 2017-2025 @polkadot/app-addresses authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus, ActionStatusBase } from '@polkadot/react-components/Status/types';
import type { FunInputFile, SaveFile } from './types.js';

import React, { useCallback, useRef, useState } from 'react';

import { Button } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';

interface Props {
  onStatusChange: (status: ActionStatus) => void
}

function Import ({ onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const importInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<SaveFile[]>([]);

  const _onImportResult = useCallback<(m: string, s?: ActionStatusBase['status']) => void>(
    (message, status = 'queued') => {
      onStatusChange?.({
        action: t('Import file'),
        message,
        status
      });
    },
  [onStatusChange, t]
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

  console.log(files);

  return (
    <>
      <input
        accept='application/json'
        onChange={_onInputImportFile}
        ref={importInputRef}
        style={{ display: 'none' }}
        type={'file'}
      />
      <Button
        icon='file-import'
        label={t('Import')}
        onClick={onImport}
      />
    </>
  );
}

export default React.memo(Import);
