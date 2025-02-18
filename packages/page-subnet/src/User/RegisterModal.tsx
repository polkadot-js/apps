// Copyright 2017-2024 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { useApi } from '@polkadot/react-hooks';
import { useTranslation } from '../translate.js';
import { InputAddress, Modal, Input } from '@polkadot/react-components';
import { TxButton } from '@polkadot/react-components';
import { callXAgereRpc } from '../callXAgereRpc.js';

interface Props {
  account: string;
  toggleOpen: () => void;
  subnetId: string;
  onSuccess: () => void;
}

function RegisterModal({ account, toggleOpen, subnetId, onSuccess:refreshData }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [selectedAccount, setSelectedAccount] = useState<string>(account);
  const [selectedSubnetId, setSelectedSubnetId] = useState<string>(subnetId);
  const [selectedValidator, setSelectedValidator] = useState<string>('');
  const [validators, setValidators] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(true)
  useEffect((): void => {
    callXAgereRpc('xagere_getDelegates', [])
      .then(response => {
        if (Array.isArray(response)) {
          const validatorAddresses = response.map((info: { delegate_ss58: string }) => info.delegate_ss58);
          setValidators(validatorAddresses);
        }
      })
      .catch(error => {
        console.error('Error fetching validators:', error);
      });
  }, []);

  return (
    <Modal
      header={t('register as a participant')}
      onClose={toggleOpen}
      size='small'
      open={modalOpen}
    >
      <Modal.Content>
        <Modal.Columns>
          <InputAddress
            defaultValue={account}
            label={t('Address')}
            onChange={(value: string | null) => setSelectedAccount(value || '')}
            type='account'
            withLabel
          />
        </Modal.Columns>
        <Modal.Columns>
          <Input
            defaultValue={subnetId}
            label={t('Subnet ID')}
            onChange={(value) => setSelectedSubnetId(value)}
            type='number'
            value={selectedSubnetId}
          />
        </Modal.Columns>
        <Modal.Columns>
          <InputAddress
            isDisabled={false}
            label={t('hot key')}
            onChange={(value: string | null) => setSelectedValidator(value || '')}
            options={validators.map(address => ({
              key: address,
              name: address,
              value: address,
              text: address
            }))}
            type='allPlus'
            value={selectedValidator}
            withLabel
          />
        </Modal.Columns>
      </Modal.Content>

      <Modal.Actions>
        <TxButton
          accountId={selectedAccount}
          icon='plus'
          label={t('Register')}
          params={[selectedSubnetId, selectedValidator]}
          tx={api.tx['xAgere']['burnedRegister']}
          onSuccess={()=>{
            toggleOpen()
            refreshData()
          }}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(RegisterModal);
