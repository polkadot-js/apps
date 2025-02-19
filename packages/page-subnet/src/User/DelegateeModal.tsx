// Copyright 2017-2024 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { useApi } from '@polkadot/react-hooks';
import { useTranslation } from '../translate.js';
import { InputAddress, Modal } from '@polkadot/react-components';
import { TxButton } from '@polkadot/react-components';

interface Props {
  account: string;
  toggleOpen: () => void;
  onSuccess: () => void;
}

function DelegateeModal({ account, toggleOpen, onSuccess:refreshData }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [selectedAccount, setSelectedAccount] = useState<string>(account);
  const [selectedValidator, setSelectedValidator] = useState<string>('');

  return (
    <Modal
      header={t('register as a delegate')}
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
            defaultValue={selectedValidator}
            label={t('hot key')}
            onChange={(value: string | null) => setSelectedValidator(value || '')}
            type='allPlus'
            withLabel
          />
        </Modal.Columns>
      </Modal.Content>

      <Modal.Actions>
        <TxButton
          accountId={selectedAccount}
          icon='plus'
          label={t('Delegate')}
          params={[selectedValidator]}
          tx={api.tx['xAgere']['becomeDelegate']}
          onSuccess={()=>{
            toggleOpen()
            refreshData()
          }}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(DelegateeModal);
