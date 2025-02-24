// Copyright 2017-2024 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';

import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import { InputAddress, InputBalance, Modal } from '@polkadot/react-components';
import { BN } from '@polkadot/util';
import { TxButton } from '@polkadot/react-components';
import { callXAgereRpc } from '../callXAgereRpc.js';
import { Available } from '@polkadot/react-query';

interface Props {
  account: string;
  modelName: string;
  toggleOpen: () => void;
  hotAddress: string;
  type: 'addStake' | 'removeStake';
  name: string;
  onSuccess: () => void;
}

interface DelegateInfo {
  delegate_ss58: string;
  take: number;
  nominators: [string, string][];
  owner_ss58: string;
}

function StakingModal({ account, modelName, toggleOpen, hotAddress, type, name, onSuccess:refreshData }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, systemChain } = useApi();
  const [amount, setAmount] = useState<BN | undefined>();
  const [selectedAccount, setSelectedAccount] = useState<string>(account);
  const [selectedValidator, setSelectedValidator] = useState<string>(hotAddress);
  const [validators, setValidators] = useState<string[]>([]);

  useEffect((): void => {
    callXAgereRpc('xagere_getDelegates', [], systemChain)
      .then(response => {
        if (Array.isArray(response)) {
          const validatorAddresses = response.map((info: DelegateInfo) => info.delegate_ss58);
          setValidators(validatorAddresses);
        }
      })
      .catch(error => {
        console.error('Error fetching validators:', error);
      });
  }, [systemChain]);

  return (
    <Modal
      header={t(modelName)}
      onClose={toggleOpen}
      size='small'
    >
      <Modal.Content>
        <Modal.Columns>
          <InputAddress
            defaultValue={account}
            label={t('Address')}
            onChange={(value: string | null) => setSelectedAccount(value || '')}
            type='account'
            labelExtra={
              <Available
                label={t('transferrable')}
                params={selectedAccount}
              />
            }
            withLabel
          />
        </Modal.Columns>
        <Modal.Columns>
          <InputAddress
            label={t('Stake for executor')}
            onChange={(value: string | null) => setSelectedValidator(value || '')}
            options={[
              ...validators.map(address => ({
                key: address,
                name: address,
                value: address,
                text: address
              })),
              {
                key: selectedValidator,
                name: selectedValidator,
                value: selectedValidator,
                text: selectedValidator
              }
            ].filter((option, index, self) =>
              index === self.findIndex((t) => t.value === option.value)
            )}
            type='allPlus'
            value={selectedValidator}
            // defaultValue={selectedValidator}
            withLabel
          />
        </Modal.Columns>
        <Modal.Columns>
          <InputBalance
            autoFocus
            label={t(`${modelName} amount`)}
            onChange={setAmount}
          />
        </Modal.Columns>
      </Modal.Content>

      <Modal.Actions>
        <TxButton
          accountId={selectedAccount}
          icon='sign-in-alt'
          label={t(name)}
          params={[selectedValidator, amount]}
          tx={api.tx['xAgere'][type]}
          onSuccess={()=>{
            toggleOpen()
            refreshData()
          }}
          />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(StakingModal);
