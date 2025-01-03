// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u128 } from '@polkadot/types';
import type { BN } from '@polkadot/util';

import React, { useState } from 'react';

import { InputAddress, InputBalance, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  nextParaId?: BN;
  onClose: () => void;
}

function RegisterId ({ className, nextParaId, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);

  return (
    <Modal
      className={className}
      header={t('Reserve ParaId')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t('This account will be used to the Id reservation and for the future parathread.')}>
          <InputAddress
            label={t('reserve from')}
            onChange={setAccountId}
            type='account'
            value={accountId}
          />
        </Modal.Columns>
        <Modal.Columns hint={t('The Id of this parachain as known on the network (selected from nextFreeId)')}>
          <InputNumber
            defaultValue={nextParaId}
            isDisabled
            label={t('parachain id')}
          />
        </Modal.Columns>
        <Modal.Columns hint={t('The reservation fee for this Id')}>
          <InputBalance
            defaultValue={api.consts.registrar.paraDeposit as u128}
            isDisabled
            label={t('reserved deposit')}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={accountId}
          icon='plus'
          isDisabled={!nextParaId}
          onStart={onClose}
          params={[]}
          tx={api.tx.registrar.reserve}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(RegisterId);
