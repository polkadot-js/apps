// Copyright 2017-2025 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatusBase } from '@polkadot/react-components/Status/types';
import type { DirFile, FileInfo, SaveFile } from './types.js';

import FileSaver from 'file-saver';
import React, { useCallback, useRef, useState } from 'react';

import { Badge, Button, CopyButton, Icon, styled, Table } from '@polkadot/react-components';
import { useQueue } from '@polkadot/react-hooks';

import { useFiles } from './hooks.js';
import { useTranslation } from './translate.js';
import UploadModal from './UploadModal.js';

const MCopyButton = styled(CopyButton)`
  .copySpan {
    display: none;
  }
`;

const ItemFile = styled.tr`
  height: 3.5rem;

  .end {
    text-align: end;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
`;

const shortStr = (name: string, count = 6): string => {
  if (name.length > (count * 2)) {
    return `${name.substring(0, count)}...${name.substring(name.length - count)}`;
  }

  return name;
};

function createUrl (f: SaveFile) {
  const endpoint = 'https://cf-ipfs.com';

  return `${endpoint}/ipfs/${f.Hash}?filename=${f.Name}`;
}

const createOnDown = (f: SaveFile) => () => {
  window.open(createUrl(f), '_blank');
  // FileSaver.saveAs(createUrl(f), f.Name);
};

type FunInputFile = (e: React.ChangeEvent<HTMLInputElement>) => void

const Noop = (): void => undefined;

export interface Props {
  className?: string,
}

function CrustFiles ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { queueAction } = useQueue();
  const [showUpMode, setShowUpMode] = useState(false);
  const wFiles = useFiles();
  const [file, setFile] = useState<FileInfo | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const _clickUploadFile = useCallback((dir = false) => {
    if (!inputRef.current) {
      return;
    }
    // eslint-disable-next-line
    // @ts-ignore
    // eslint-disable-next-line
    inputRef.current.webkitdirectory = dir;
    // eslint-disable-next-line
    inputRef.current.multiple = dir;
    inputRef.current.click();
  }, [inputRef]);
  const onClickUpFile = useCallback(() => _clickUploadFile(false), [_clickUploadFile]);
  const onClickUpFolder = useCallback(() => _clickUploadFile(true), [_clickUploadFile]);
  const _onInputFile = useCallback<FunInputFile>((e) => {
    const files = e.target.files;

    if (!files) {
      return;
    }

    if (files.length > 2000) {
      queueAction({
        action: 'Upload Folder',
        message: t('Please do not upload more than 2000 files'),
        status: 'error'
      });

      return;
    }

    if (files.length === 0) {
      queueAction({
        action: 'Upload Folder',
        message: t('Please select non-empty folder'),
        status: 'error'
      });

      return;
    }

    // eslint-disable-next-line
    // @ts-ignore
    // eslint-disable-next-line
    const isDirectory = e.target.webkitdirectory;

    if (!isDirectory) {
      setFile({ file: files[0] });
      setShowUpMode(true);
    } else if (files.length >= 1) {
      // eslint-disable-next-line
      // @ts-ignore eslint-disable-next-line
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const dirFiles: DirFile[] = [];

      for (let i = 0, count = files.length; i < count; i++) {
        // console.info('f:', files[index]);
        dirFiles.push(files[i]);
      }

      console.info(dirFiles);

      const [dir] = dirFiles[0].webkitRelativePath.split('/');

      setFile({ dir, files: dirFiles });
      setShowUpMode(true);
    }

    e.target.value = '';
  }, [setFile, setShowUpMode, queueAction, t]);

  const _onImportResult = useCallback<(m: string, s?: ActionStatusBase['status']) => void>(
    (message, status = 'queued') => {
      queueAction && queueAction({
        action: t('Import files'),
        message,
        status
      });
    },
  [queueAction, t]
  );
  const importInputRef = useRef<HTMLInputElement>(null);
  const _clickImport = useCallback(() => {
    if (!importInputRef.current) {
      return;
    }

    importInputRef.current.click();
  }, [importInputRef]);
  const _onInputImportFile = useCallback<FunInputFile>((e) => {
    try {
      _onImportResult(t('Importing'));
      const fileReader = new FileReader();
      const files = e.target.files;

      if (!files) {
        return;
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
        const mapImport: Record<string, boolean> = {};

        for (const item of _list) {
          if (item.Hash && item.Name && item.UpEndpoint && item.PinEndpoint) {
            fitter.push(item);
            mapImport[item.Hash] = true;
          }
        }

        const filterOld = wFiles.files.filter((item) => !mapImport[item.Hash]);

        wFiles.setFiles([...fitter, ...filterOld]);
        _onImportResult(t('Import Success'), 'success');
      };
    } catch {
      _onImportResult(t('file content error'), 'error');
    }
  }, [wFiles, _onImportResult, t]);

  const _onClose = useCallback(() => {
    setShowUpMode(false);
  }, []);

  const _onSuccess = useCallback((res: SaveFile) => {
    setShowUpMode(false);
    const filterFiles = wFiles.files.filter((f) => f.Hash !== res.Hash);

    wFiles.setFiles([res, ...filterFiles]);
  }, [wFiles]);

  const _export = useCallback(() => {
    const blob = new Blob([JSON.stringify(wFiles.files)], { type: 'application/json; charset=utf-8' });

    // eslint-disable-next-line deprecation/deprecation
    FileSaver.saveAs(blob, 'files.json');
  }, [wFiles]);

  return <StyledMain className={className}>
    <header></header>
    <input
      onChange={_onInputFile}
      ref={inputRef}
      style={{ display: 'none' }}
      type={'file'}
    />
    <input
      onChange={_onInputImportFile}
      ref={importInputRef}
      style={{ display: 'none' }}
      type={'file'}
    />
    {file && showUpMode && (
      <UploadModal
        file={file}
        onClose={_onClose}
        onSuccess={_onSuccess}
      />
    )}
    <div style={{ display: 'flex', paddingBottom: '1.5rem' }}>
      <div className='uploadBtn'>
        <Button
          icon={'upload'}
          label={t('Upload')}
          onClick={Noop}
        />
        <div className='uploadMenu'>
          <div
            className='menuItem'
            onClick={onClickUpFile}
          >{t('File')}</div>
          <div
            className='menuItem'
            onClick={onClickUpFolder}
          >{t('Folder')}</div>
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <Button
        icon={'file-import'}
        label={t('Import')}
        onClick={_clickImport}
      />
      <Button
        icon={'file-export'}
        label={t('Export')}
        onClick={_export}
      />
    </div>
    <Table
      empty={t('No files')}
      emptySpinner={t('Loading')}
      header={[
        [t('files'), 'start', 2],
        [t('file cid'), 'expand', 2],
        [undefined, 'start'],
        [t('file size'), 'expand', 2],
        [t('status'), 'expand'],
        [t('action'), 'expand'],
        []
      ]}
    >
      {wFiles.files.map((f, index) =>
        <ItemFile key={`files_item-${index}`}>
          <td
            className=''
            colSpan={2}
          >
            {f.items && (
              <Icon
                className='highlight--color'
                icon='folder'
              />
            )}
            {shortStr(f.Name)}</td>
          <td
            className='end'
            colSpan={2}
          >{f.Hash}</td>
          <td
            className=''
            colSpan={1}
          >
            <MCopyButton value={f.Hash}>
              <Badge
                color='highlight'
                hover={t('Copy file cid')}
                icon='copy'
              />
            </MCopyButton>
          </td>
          <td
            className='end'
            colSpan={2}
          >{`${f.Size} bytes`}</td>
          <td
            className='end'
            colSpan={1}
          >
            <a
              href={'https://apps.crust.network/?rpc=wss%3A%2F%2Frpc.crust.network#/storage_files/status/' + f.Hash}
              rel='noreferrer'
              target='_blank'
            >{t('View status in Crust')}</a>
          </td>
          <td
            className='end'
            colSpan={1}
          >
            <div className='actions'>
              {!f.items && (
                <Badge
                  color='highlight'
                  hover={t('Download')}
                  icon='download'
                  onClick={createOnDown(f)}
                />
              )}
              <MCopyButton value={createUrl(f)}>
                <Badge
                  color='highlight'
                  hover={t('Copy link')}
                  icon='copy'
                />
              </MCopyButton>

            </div>
          </td>
          <td colSpan={1} />
        </ItemFile>
      )}
    </Table>
    <div>
      {t('Note: The file list is cached locally, switching browsers or devices will not keep displaying the original browser information.')}
    </div>
  </StyledMain>;
}

const StyledMain = styled.main`
  h1 {
    text-transform: unset !important;
  }

  .uploadBtn {
    position: relative;
    padding: 5px 0;

    &:hover {
      .uploadMenu {
        display: block;
      }
    }
  }

  .uploadMenu {
    z-index: 200;
    display: none;
    background-color: var(--bg-table);
    position: absolute;
    top: 43px;
    left: 0;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
    border-radius: 4px;
    overflow: hidden;
    line-height: 40px;

    .menuItem {
      cursor: pointer;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      white-space: nowrap;

      &:hover {
        background-color: var(--bg-page);
      }
    }
  }
`;

export default React.memo(CrustFiles);
