// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FileState } from '@canvas-ui/react-hooks/types';
import { BareProps } from './types';

import React, { useCallback } from 'react';
import { useAbi, useFile, useNotification, useToggle } from '@canvas-ui/react-hooks';
import { truncate } from '@canvas-ui/react-util';

import Button from './Button';
import InputABI from './InputABI';
import Modal from './Modal';
import { useTranslation } from './translate';

interface Props extends BareProps {
  codeHash: string;
  label: React.ReactNode;
  onSave: (_: FileState) => void;
}

function CodeUploadABI ({ codeHash, label, onSave }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const showNotification = useNotification();
  const [isOpen, toggleIsOpen] = useToggle();
  const { abi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi();
  const [abiFile, setAbiFile] = useFile({ onChange: onChangeAbi, onRemove: onRemoveAbi });

  const _onSave = useCallback(
    (): void => {
      if (abiFile) {
        onSave(abiFile);

        showNotification({
          action: truncate(codeHash, 12),
          message: t<string>('code bundle ABI updated'),
          status: 'success'
        });
        toggleIsOpen();
      }
    },
    [abiFile, codeHash, onSave, showNotification, t, toggleIsOpen]
  );

  return (
    <>
      <Button
        label={label}
        onClick={toggleIsOpen}
      />
      <Modal
        isOpen={isOpen}
        onClose={toggleIsOpen}
      >
        <Modal.Header>{t<string>('Upload ABI')}</Modal.Header>
        <Modal.Content>
          <InputABI
            abi={abi}
            errorText={errorText}
            file={abiFile}
            isError={isAbiError}
            isSupplied={isAbiSupplied}
            isValid={isAbiValid}
            onChange={onChangeAbi}
            onRemove={onRemoveAbi}
            setFile={setAbiFile}
            withLabel={false}
          />
        </Modal.Content>
        <Modal.Actions onCancel={toggleIsOpen}>
          <Button
            isDisabled={!abiFile || !isAbiValid}
            isPrimary
            label={t<string>('Save')}
            onClick={_onSave}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default React.memo(CodeUploadABI);
