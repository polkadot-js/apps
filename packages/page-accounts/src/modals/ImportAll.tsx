// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Dispatch, SetStateAction } from 'react';
import type { KeyringPair$Meta } from '@polkadot/keyring/types';
import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { ModalProps } from '../types.js';

import React, { useCallback, useState } from 'react';

import { Button, InputFile, MarkError, Modal } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';
import { nextTick, u8aToString } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props extends ModalProps {
  className?: string;
  onClose: () => void;
  onStatusChange: (status: ActionStatus) => void;
}

interface FileAccount {
  address: string;
  meta: KeyringPair$Meta;
}

type File = FileAccount[]

const acceptedFormats = ['application/json'];

function isValidFile (fileContent: string, setError: Dispatch<SetStateAction<string | null>>): boolean {
  setError(null);

  try {
    const content = JSON.parse(fileContent) as File;

    if (!Array.isArray(content)) {
      throw new Error('Invalid format: File content should be an array');
    }

    for (const item of content) {
      if (
        typeof item.address !== 'string' ||
        typeof item.meta !== 'object' ||
        item.meta === null
      ) {
        throw new Error('Invalid format: Each item must have a string "address" and an object "meta"');
      }
    }

    return true;
  } catch (error) {
    console.error(error);
    setError((error as Error).message ? (error as Error).message : (error as Error).toString());

    return false;
  }
}

function ImportAll ({ className, onClose, onStatusChange }: Props): React.ReactElement | null {
  const { t } = useTranslation();
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const _onChangeFile = useCallback(
    (file: Uint8Array) => {
      const fileContent = u8aToString(file);

      setFile(isValidFile(fileContent, setError) ? JSON.parse(fileContent) as File : null);
    },
    []
  );

  const _onImportButtonClick = useCallback(() => {
    setIsBusy(true);
    nextTick((): void => {
      const status: Partial<ActionStatus> = { action: 'import' };

      try {
        file?.map((pair) =>
          keyring.addExternal(pair.address, pair.meta)
        );

        status.status = 'success';
        status.message = t('all accounts imported');
      } catch (error) {
        status.status = 'error';
        status.message = (error as Error).message;
        console.error(error);
      }

      setIsBusy(false);
      onStatusChange(status as ActionStatus);

      if (status.status !== 'error') {
        onClose();
      }
    });
  }, [file, onClose, onStatusChange, t]);

  return (
    <Modal
      className={className}
      header={t('import all accounts')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t('Supply a backed-up JSON file')}>
          <InputFile
            accept={acceptedFormats}
            className='full'
            isError={!file}
            label={t('backup file')}
            onChange={_onChangeFile}
            withLabel
          />
        </Modal.Columns>
        <Modal.Columns>
          {error && (
            <MarkError content={error} />
          )}
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon='sync'
          isBusy={isBusy}
          isDisabled={!file || !!error}
          label={t('Import')}
          onClick={_onImportButtonClick}
        />
      </Modal.Actions>

    </Modal>
  );
}

export default React.memo(ImportAll);
