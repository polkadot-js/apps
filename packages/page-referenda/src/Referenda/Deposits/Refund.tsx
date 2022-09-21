// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { PalletReferenda } from '../../types';

import React, { useState } from 'react';

import { Button, InputAddress, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  id: BN;
  palletReferenda: PalletReferenda;
}

function Refund ({ className = '', id, palletReferenda }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);

  return (
    <>
      {isOpen && (
        <Modal
          className={className}
          header={t<string>('Refund decision deposit')}
          onClose={toggleOpen}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('The transaction will be submitted from this account.')}>
              <InputAddress
                help={t<string>('The account you want to refund from')}
                label={t<string>('refund from account')}
                onChange={setAccountId}
                type='account'
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The referendum this deposit would apply to.')}>
              <InputNumber
                defaultValue={id}
                isDisabled
                label={t<string>('referendum id')}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='minus'
              label={t<string>('Refund deposit')}
              onStart={toggleOpen}
              params={[id]}
              tx={api.tx[palletReferenda as 'referenda'].refundDecisionDeposit}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='minus'
        label={t<string>('Refund deposit')}
        onClick={toggleOpen}
      />
    </>
  );
}

export default React.memo(Refund);
