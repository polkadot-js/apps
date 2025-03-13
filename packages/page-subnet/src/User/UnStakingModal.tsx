// Copyright 2017-2024 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import { InputAddress, InputBalance, Modal } from '@polkadot/react-components';
import { BN } from '@polkadot/util';
import { TxButton } from '@polkadot/react-components';

interface Props {
  account: string;
  modelName: string;
  toggleOpen: () => void;
  hotAddress: string;
  type: 'addStake' | 'removeStake';
  name: string;
  onSuccess: () => void;
  showAmountInfo?:React.ReactNode
}

function UnStakingModal({ account, modelName, toggleOpen, hotAddress, type, name, onSuccess:refreshData, showAmountInfo }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>();

  return (
    <Modal
      header={t(modelName)}
      onClose={toggleOpen}
      size='small'
    >
      <Modal.Content>
        <Modal.Columns>
          <InputAddress
            isDisabled={true}
            value={account}
            label={t('Address')}
            type='account'
            labelExtra={
              showAmountInfo
            }
            withLabel
          />
        </Modal.Columns>
        <Modal.Columns>
          <InputAddress
            isDisabled={true}
            label={t('Stake for participant')}
            type='allPlus'
            value={hotAddress}
            defaultValue={hotAddress}
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
          accountId={account}
          icon='sign-in-alt'
          label={t(name)}
          params={[hotAddress, amount]}
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

export default React.memo(UnStakingModal);
