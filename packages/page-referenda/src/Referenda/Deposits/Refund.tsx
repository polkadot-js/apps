// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { PalletReferenda } from '../../types.js';

import React, { useState } from 'react';

import { Button, InputAddress, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate.js';

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
          header={t('Refund decision deposit')}
          onClose={toggleOpen}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t('The transaction will be submitted from this account.')}>
              <InputAddress
                label={t('refund from account')}
                onChange={setAccountId}
                type='account'
              />
            </Modal.Columns>
            <Modal.Columns hint={t('The referendum this deposit would apply to.')}>
              <InputNumber
                defaultValue={id}
                isDisabled
                label={t('referendum id')}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='minus'
              label={t('Refund deposit')}
              onStart={toggleOpen}
              params={[id]}
              tx={api.tx[palletReferenda as 'referenda'].refundDecisionDeposit}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='minus'
        label={t('Refund deposit')}
        onClick={toggleOpen}
      />
    </>
  );
}

export default React.memo(Refund);
