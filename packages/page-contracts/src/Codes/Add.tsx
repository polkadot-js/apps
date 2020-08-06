// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StringOrNull } from '@polkadot/react-components/types';

import React, { useCallback, useMemo, useState } from 'react';
import { createType } from '@polkadot/types';
import { registry } from '@polkadot/react-api';
import { Button, Input, Modal } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { isNull } from '@polkadot/util';
import { ABI, InputName } from '../shared';

import ValidateCode from './ValidateCode';
import store from '../store';
import { useTranslation } from '../translate';
import useAbi from '../useAbi';

function Add (): React.ReactElement {
  const { t } = useTranslation();
  const [isOpen, toggleIsOpen, setIsOpen] = useToggle();
  const [codeHash, setCodeHash] = useState('');
  const [isCodeHashValid, setIsCodeHashValid] = useState(false);
  const [name, setName] = useState<StringOrNull>(null);
  const { abi, contractAbi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi();

  const isNameValid = useMemo(
    (): boolean => !isNull(name) && name.length > 0,
    [name]
  );

  const isValid = useMemo(
    (): boolean => isCodeHashValid && isNameValid,
    [isCodeHashValid, isNameValid]
  );

  const _onSave = useCallback(
    (): void => {
      if (!codeHash || !name) {
        return;
      }

      store
        .saveCode(createType(registry, 'Hash', codeHash), { abi, name, tags: [] })
        .then((): void => setIsOpen(false))
        .catch((error): void => {
          console.error('Unable to save code', error);
        });
    },
    [abi, codeHash, name, setIsOpen]
  );

  return (
    <>
      <Button
        icon='plus'
        label={t('Add an existing code hash')}
        onClick={toggleIsOpen}
      />
      {isOpen && (
        <Modal header={t('Add an existing code hash')}>
          <Modal.Content>
            <Input
              autoFocus
              help={t('The code hash for the on-chain deployed code.')}
              isError={codeHash.length > 0 && !isCodeHashValid}
              label={t('code hash')}
              onChange={setCodeHash}
              value={codeHash}
            />
            <ValidateCode
              codeHash={codeHash}
              onChange={setIsCodeHashValid}
            />
            <InputName
              isError={!isNameValid}
              onChange={setName}
              value={name || undefined}
            />
            <ABI
              contractAbi={contractAbi}
              errorText={errorText}
              isError={isAbiError}
              isSupplied={isAbiSupplied}
              isValid={isAbiValid}
              onChange={onChangeAbi}
              onRemove={onRemoveAbi}
              withLabel
            />
          </Modal.Content>
          <Modal.Actions onCancel={toggleIsOpen}>
            <Button
              icon='save'
              isDisabled={!isValid}
              label={t('Save')}
              onClick={_onSave}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Add);
