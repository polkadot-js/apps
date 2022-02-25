// Copyright 2017-2022 @polkadot/app-uniques authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletUniquesClassDetails, PalletUniquesClassMetadata } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import React, { useMemo, useState } from 'react';

import { InputAddress, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  details: PalletUniquesClassDetails;
  classId: BN;
  metadata: PalletUniquesClassMetadata;
  onClose: () => void;
}

function Mint ({ className, details: { issuer }, classId, metadata, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [instanceId, setInstanceId] = useState<BN | null>(null);
  const [recipientId, setRecipientId] = useState<string | null>(null);

  const isInstanceIdValid = useMemo(
    () => instanceId && !instanceId.isNeg(),
    [instanceId, 0]
  );

  return (
    <Modal
      className={className}
      header={t<string>('mint unique')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t<string>('The recipient account for this minting operation.')}>
          <InputAddress
            defaultValue={issuer}
            isDisabled
            label={t<string>('issuer account')}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The instance number that is unique to this class.')}>
          <InputNumber
            autoFocus
            isError={!isInstanceIdValid}
            isZeroable={false}
            label={t<string>('instance number')}
            onChange={setInstanceId}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The recipient account for this minting operation.')}>
          <InputAddress
            label={t<string>('mint to address')}
            onChange={setRecipientId}
            type='allPlus'
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={issuer}
          icon='plus'
          isDisabled={!recipientId || !isInstanceIdValid}
          label={t<string>('Mint')}
          onStart={onClose}
          params={[classId, instanceId, recipientId]}
          tx={api.tx.uniques.mint}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Mint);
