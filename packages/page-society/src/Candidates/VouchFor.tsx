// Copyright 2017-2022 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useState } from 'react';

import { InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  allMembers: string[];
  onClose: () => void;
}

function VouchNew ({ allMembers, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>();
  const [tip, setTip] = useState<BN | undefined>();
  const [accountId, setAccount] = useState<string | null | undefined>();
  const [candidateId, setCandidate] = useState<string | null | undefined>();

  return (
    <Modal
      header= {t<string>('Vouch for a new candidate')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t<string>('Your member account that the vouch is made from.')}>
          <InputAddress
            filter={allMembers}
            label={t<string>('member account')}
            onChange={setAccount}
            type='account'
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The candidate/bid account. Once accepted this account will become a member.')}>
          <InputAddress
            label={t<string>('bid account')}
            onChange={setCandidate}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The amount to tie to your bid. The lowest bidder moves forward.')}>
          <InputBalance
            autoFocus
            label={t<string>('bid amount')}
            onChange={setAmount}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The amount you wish to be tipped for your bid.')}>
          <InputBalance
            label={t<string>('tip amount')}
            onChange={setTip}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={accountId}
          icon='sign-in-alt'
          isDisabled={!amount || !candidateId || !tip}
          label={t<string>('Vouch')}
          onStart={onClose}
          params={[candidateId, amount, tip]}
          tx={api.tx.society.vouch}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(VouchNew);
