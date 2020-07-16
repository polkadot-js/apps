// Copyright 2017-2020 @polkadot/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FileState } from '@polkadot/react-hooks/types';
import { BareProps } from './types';

import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useAbi, useFile, useToggle } from '@polkadot/react-hooks';

import Button from './Button';
import InputABI from './InputABI';
import Modal from './Modal';
import { useTranslation } from './translate';

interface Props extends BareProps {
  label: React.ReactNode;
  onSave: (_: FileState) => void;
}

function CodeUploadABI ({ className, label, onSave }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isOpen, toggleIsOpen] = useToggle();
  const { contractAbi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi();
  const [abiFile, setAbiFile] = useFile({ onChange: onChangeAbi, onRemove: onRemoveAbi });

  const _onSave = useCallback(
    (): void => {
      if (!!abiFile) {
        onSave(abiFile);
        toggleIsOpen();
      }
    },
    [abiFile, onSave, toggleIsOpen]
  )

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
        <Modal.Header>{t('Upload ABI')}</Modal.Header>
        <Modal.Content>
          <InputABI
            contractAbi={contractAbi}
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
            label={t('Save')}
            onClick={_onSave}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default styled(React.memo(CodeUploadABI))`
`
