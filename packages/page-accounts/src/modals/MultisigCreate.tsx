// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ActionStatus } from '@polkadot/react-components/Status/types';
import { ModalProps } from '../types';

import BN from 'bn.js';
import React, { useCallback, useState } from 'react';
import { Button, Input, InputAddressMulti, InputNumber, Modal } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';

import { useTranslation } from '../translate';
import useKnownAddresses from '../Accounts/useKnownAddresses';

interface Props extends ModalProps {
  className?: string;
  onClose: () => void;
  onStatusChange: (status: ActionStatus) => void;
}

interface CreateOptions {
  genesisHash?: string;
  name: string;
  tags?: string[];
}

const MAX_SIGNATORIES = 16;
const BN_TWO = new BN(2);

function createMultisig (signatories: string[], threshold: BN | number, { genesisHash, name, tags = [] }: CreateOptions, success: string): ActionStatus {
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
    status.message = (error as Error).message;
  }

  return status;
}

function Multisig ({ className = '', onClose, onStatusChange }: Props): React.ReactElement<Props> {
  const { api, isDevelopment } = useApi();
  const { t } = useTranslation();
  const availableSignatories = useKnownAddresses();
  const [{ isNameValid, name }, setName] = useState({ isNameValid: false, name: '' });
  const [signatories, setSignatories] = useState<string[]>(['']);
  const [{ isThresholdValid, threshold }, setThreshold] = useState({ isThresholdValid: true, threshold: BN_TWO });

  const _createMultisig = useCallback(
    (): void => {
      const options = { genesisHash: isDevelopment ? undefined : api.genesisHash.toString(), name: name.trim() };
      const status = createMultisig(signatories, threshold, options, t<string>('created multisig'));

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
      threshold && setThreshold({ isThresholdValid: threshold.gte(BN_TWO) && threshold.lten(signatories.length), threshold }),
    [signatories]
  );

  const isValid = isNameValid && isThresholdValid;

  return (
    <Modal
      className={className}
      header={t<string>('Add multisig')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddressMulti
              available={availableSignatories}
              availableLabel={t<string>('available signatories')}
              help={t<string>('The addresses that are able to approve multisig transactions. You can select up to {{maxHelpers}} trusted addresses.', { replace: { maxHelpers: MAX_SIGNATORIES } })}
              maxCount={MAX_SIGNATORIES}
              onChange={setSignatories}
              value={signatories}
              valueLabel={t<string>('selected signatories')}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The signatories has the ability to create transactions using the multisig and approve transactions sent by others.Once the threshold is reached with approvals, the multisig transaction is enacted on-chain.')}</p>
            <p>{t<string>('Since the multisig function like any other account, once created it is available for selection anywhere accounts are used and needs to be funded before use.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <InputNumber
              help={t<string>('The threshold for this multisig')}
              isError={!isThresholdValid}
              label={t<string>('threshold')}
              onChange={_onChangeThreshold}
              value={threshold}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The threshold for approval should be less or equal to the number of signatories for this multisig.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <Input
              autoFocus
              className='full'
              help={t<string>('Name given to this multisig. You can edit it at any later point in time.')}
              isError={!isNameValid}
              label={t<string>('name')}
              onChange={_onChangeName}
              placeholder={t<string>('multisig name')}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The name is for unique identification of the account in your owner lists.')}</p>
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <Button
          icon='plus'
          isDisabled={!isValid}
          label={t<string>('Create')}
          onClick={_createMultisig}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Multisig);
