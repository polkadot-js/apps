// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActionStatus } from '@polkadot/react-components/Status/types';
import { ModalProps } from '../../types';

import BN from 'bn.js';
import React, { useCallback, useMemo, useState } from 'react';
import { Button, Input, InputAddress, InputNumber, Modal } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';

import { useTranslation } from '../../translate';

interface Props extends ModalProps {
  className?: string;
  onClose: () => void;
}

interface CreateOptions {
  genesisHash?: string;
  name: string;
  tags?: string[];
}

type Setter = (address: string| null) => void;

const MAX_SIGNATORIES = 16;

function createAccount (signatories: string[], threshold: BN | number, { genesisHash, name, tags = [] }: CreateOptions, success: string): ActionStatus {
  // we will fill in all the details below
  const status = { action: 'create' } as ActionStatus;

  try {
    const result = keyring.addMultisig(signatories, threshold, { genesisHash, name, tags });
    const { address } = result.pair;

    status.account = address;
    status.status = 'success';
    status.message = success;
  } catch (error) {
    status.status = 'error';
    status.message = error.message;
  }

  return status;
}

function Multisig ({ className, onClose, onStatusChange }: Props): React.ReactElement<Props> {
  const { api, isDevelopment } = useApi();
  const { t } = useTranslation();
  const [{ isNameValid, name }, setName] = useState({ isNameValid: false, name: '' });
  const [signatories, setSignatories] = useState<string[]>(['']);
  const [{ isThresholdValid, threshold }, setThreshold] = useState({ isThresholdValid: true, threshold: new BN(1) });
  const setSignatory = useMemo((): Setter[] => {
    return Array(MAX_SIGNATORIES).fill(0).map((_, index): Setter =>
      (address: string | null): void => {
        setSignatories((signatories: string[]): string[] => {
          if (address) {
            signatories[index] = address;
          }

          return signatories;
        });
      }
    );
  }, []);
  const isValid = isNameValid && isThresholdValid;

  const _createMultisig = useCallback(
    (): void => {
      const options = { genesisHash: isDevelopment ? undefined : api.genesisHash.toString(), name: name.trim() };
      const status = createAccount(signatories, threshold, options, t('created multisig'));

      onStatusChange(status);
      onClose();
    },
    [api.genesisHash, isDevelopment, name, onClose, onStatusChange, signatories, t, threshold]
  );

  const _onChangeName = useCallback(
    (name: string) => setName({ isNameValid: (name.trim().length >= 3), name }),
    []
  );

  const _onChangeThreshold = useCallback(
    (threshold: BN | undefined) =>
      threshold && setThreshold({ isThresholdValid: threshold.gtn(0) && threshold.lten(signatories.length), threshold }),
    [signatories]
  );

  const _onLess = useCallback(
    () => setSignatories((signatories) => signatories.slice(0, signatories.length - 1)),
    []
  );

  const _onMore = useCallback(
    () => setSignatories((signatories) => signatories.concat('')),
    []
  );

  return (
    <Modal
      className={className}
      header={t('Add multisig')}
    >
      <Modal.Content>
        <Input
          autoFocus
          className='full'
          help={t('Name given to this multisig. You can edit it it any later point in time.')}
          isError={!isNameValid}
          label={t('name')}
          onChange={_onChangeName}
          placeholder={t('multisig name')}
        />
        <InputNumber
          help={t('The threshold for this multisig')}
          isError={!isThresholdValid}
          label={t('threshold')}
          onChange={_onChangeThreshold}
        />
        {signatories.map((_, index) => (
          <InputAddress
            key={index}
            label={t('signatory {{index}}/{{length}}', { replace: { index: index + 1, length: signatories.length } })}
            onChange={setSignatory[index]}
            value={signatories[index]}
          />
        ))}
        <Button.Group>
          <Button
            icon='minus'
            isDisabled={signatories.length === 1}
            label={t('Less')}
            onClick={_onLess}
          />
          <Button.Or />
          <Button
            icon='plus'
            isDisabled={signatories.length === MAX_SIGNATORIES}
            label={t('More')}
            onClick={_onMore}
          />
        </Button.Group>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <Button
          icon='plus'
          isDisabled={!isValid}
          isPrimary
          label={t('Create')}
          onClick={_createMultisig}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Multisig);
