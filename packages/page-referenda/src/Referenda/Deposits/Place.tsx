// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferendaTrackDetails } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { PalletReferenda } from '../../types.js';

import React, { useState } from 'react';

import { Button, InputAddress, InputBalance, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';

import { useTranslation } from '../../translate.js';

interface Props {
  className?: string;
  id: BN;
  palletReferenda: PalletReferenda;
  track: PalletReferendaTrackDetails;
}

function Deposit ({ className = '', id, palletReferenda, track }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);

  return (
    <>
      {isOpen && (
        <Modal
          className={className}
          header={t('Place decision deposit')}
          onClose={toggleOpen}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t('The deposit will be registered from this account and the balance lock will be applied here.')}>
              <InputAddress
                label={t('deposit from account')}
                labelExtra={
                  <Available
                    label={<span className='label'>{t('transferable')}</span>}
                    params={accountId}
                  />
                }
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
            <Modal.Columns hint={t('The deposit for this proposal will be locked for the referendum duration.')}>
              <InputBalance
                defaultValue={track.decisionDeposit}
                isDisabled
                label={t('decision deposit')}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='plus'
              label={t('Place deposit')}
              onStart={toggleOpen}
              params={[id]}
              tx={api.tx[palletReferenda as 'referenda'].placeDecisionDeposit}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='plus'
        label={t('Decision deposit')}
        onClick={toggleOpen}
      />
    </>
  );
}

export default React.memo(Deposit);
