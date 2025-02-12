// Copyright 2017-2024 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { useAccounts, useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import { InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import BN from 'bn.js';

interface Props {
  modelName: string
  toggleOpen: ()=>void;
  hotAddress: string
  type: string
  name: string
  account: string
}

function StakingModal ({ modelName, toggleOpen, hotAddress, type, name, account }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>();
  const [selectedAccount, setSelectedAccount] = useState<string>(account);

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
            withLabel
          />
        </Modal.Columns>
        <Modal.Columns>
          <InputAddress
            defaultValue={hotAddress}
            isDisabled={!!hotAddress}
            hideAddress={true}
            label={t('Stake for executor')}
            labelExtra={
              <span> </span>
            }
            type='allPlus'
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
          params={[hotAddress, amount]}
          tx={api.tx['xAgere'][type]}
          onStart={toggleOpen}
          onSuccess={toggleOpen}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(StakingModal);
