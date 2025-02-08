// Copyright 2017-2024 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { useAccounts, useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import { InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import BN from 'bn.js';

interface Props {
  toggleOpen: ()=>void;
  hotAddress: string
  type: string
  name: string
}

function StakingModal ({ toggleOpen, hotAddress, type, name }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const [amount, setAmount] = useState<BN | undefined>();


  return (
    <Modal
      header={t('Vote on proposal')}
      onClose={toggleOpen}
      size='small'
    >
      <Modal.Content>
        <Modal.Columns>
          <InputAddress
            label={t('setHotAddress')}
            type='account'
            withLabel
          />
        </Modal.Columns>
        <Modal.Columns>
          <InputAddress
            defaultValue={hotAddress}
            isDisabled={!!hotAddress}
            hideAddress={true}
            label={t('Vote for validator')}
            labelExtra={
              <span> </span>
            }
            type='allPlus'
          />
        </Modal.Columns>
        <Modal.Columns>
          <InputBalance
            autoFocus
            label={t('setAmount')}
            onChange={setAmount}
          />
        </Modal.Columns>
      </Modal.Content>

      <Modal.Actions>
        <TxButton
          accountId={hasAccounts ? allAccounts[0] : ''}
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
