// Copyright 2017-2025 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useState } from 'react';

import { InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';

interface Props {
  onClose: () => void;
}

function BidNew ({ onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>();
  const [accountId, setAccount] = useState<string | null | undefined>();

  return (
    <Modal
      header= {t('Bid to join')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t('Your candidate/bid account. Once accepted this account will become a member.')}>
          <InputAddress
            label={t('bid account')}
            onChange={setAccount}
            type='account'
          />
        </Modal.Columns>
        <Modal.Columns hint={t('The amount to tie to your bid. The lowest bidder moves forward.')}>
          <InputBalance
            autoFocus
            label={t('bid amount')}
            onChange={setAmount}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={accountId}
          icon='sign-in-alt'
          isDisabled={!amount}
          label={t('Bid')}
          onStart={onClose}
          params={[amount]}
          tx={api.tx.society.bid}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(BidNew);
