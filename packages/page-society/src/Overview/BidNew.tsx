// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, { useState } from 'react';
import { InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  onClose: () => void;
}

function BidNew ({ onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<BN | undefined>();
  const [accountId, setAccount] = useState<string | null | undefined>();

  return (
    <Modal
      header= {t<string>('Bid to join')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              help={t<string>('The actual account you wish to sub,it the bid with')}
              label={t<string>('bid account')}
              onChange={setAccount}
              type='account'
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('Your canidate/bid account. Once accepted this account will become a member.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <InputBalance
              autoFocus
              help={t<string>('The amount to associate with your bid, should be less than the pot.')}
              label={t<string>('bid amount')}
              onChange={setAmount}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The amount to tie to your bid. The lowest bidder moves forward.')}</p>
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountId}
          icon='sign-in-alt'
          isDisabled={!amount}
          label={t<string>('Bid')}
          onStart={onClose}
          params={[amount]}
          tx='society.bid'
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(BidNew);
