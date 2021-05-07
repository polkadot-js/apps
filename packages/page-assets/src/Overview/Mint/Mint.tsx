// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { AssetDetails, AssetId, AssetMetadata } from '@polkadot/types/interfaces';

import React, { useMemo, useState } from 'react';

import { InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  details: AssetDetails;
  id: AssetId;
  metadata: AssetMetadata;
  onClose: () => void;
}

function Mint ({ className, details: { issuer, minBalance }, id, metadata, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | null>(null);
  const [recipientId, setRecipientId] = useState<string | null>(null);

  const isAmountValid = useMemo(
    () => amount && amount.gte(minBalance),
    [amount, minBalance]
  );

  const [siDecimals, siSymbol] = useMemo(
    () => [metadata.decimals.toNumber(), metadata.symbol.toUtf8().toUpperCase()],
    [metadata]
  );

  return (
    <Modal
      className={className}
      header={t<string>('mint asset')}
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
        <Modal.Columns hint={t<string>('The recipient account for this minting operation.')}>
          <InputAddress
            label={t<string>('mint to address')}
            onChange={setRecipientId}
            type='allPlus'
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The amount of tokens to issue to the account.')}>
          <InputBalance
            autoFocus
            isError={!isAmountValid}
            isZeroable={false}
            label={t<string>('amount to issue')}
            onChange={setAmount}
            siDecimals={siDecimals}
            siSymbol={siSymbol}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The minimum balance allowed for the asset.')}>
          <InputBalance
            defaultValue={minBalance}
            isDisabled
            label={t<string>('minimum balance')}
            siDecimals={siDecimals}
            siSymbol={siSymbol}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={issuer}
          icon='plus'
          isDisabled={!recipientId || !isAmountValid}
          label={t<string>('Mint')}
          onStart={onClose}
          params={[id, recipientId, amount]}
          tx={api.tx.assets.mint}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Mint);
