// Copyright 2017-2025 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletAssetsAssetDetails, PalletAssetsAssetMetadata } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

import React, { useMemo, useState } from 'react';

import { InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate.js';

interface Props {
  className?: string;
  details: PalletAssetsAssetDetails;
  id: BN;
  metadata: PalletAssetsAssetMetadata;
  onClose: () => void;
}

function Mint ({ className, details: { issuer, minBalance }, id, metadata, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>();
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
      header={t('mint asset')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t('The recipient account for this minting operation.')}>
          <InputAddress
            defaultValue={issuer}
            isDisabled
            label={t('issuer account')}
          />
        </Modal.Columns>
        <Modal.Columns hint={t('The recipient account for this minting operation.')}>
          <InputAddress
            label={t('mint to address')}
            onChange={setRecipientId}
            type='allPlus'
          />
        </Modal.Columns>
        <Modal.Columns hint={t('The amount of tokens to issue to the account.')}>
          <InputBalance
            autoFocus
            isError={!isAmountValid}
            isZeroable={false}
            label={t('amount to issue')}
            onChange={setAmount}
            siDecimals={siDecimals}
            siSymbol={siSymbol}
          />
        </Modal.Columns>
        <Modal.Columns hint={t('The minimum balance allowed for the asset.')}>
          <InputBalance
            defaultValue={minBalance}
            isDisabled
            label={t('minimum balance')}
            siDecimals={siDecimals}
            siSymbol={siSymbol}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={issuer}
          icon='plus'
          isDisabled={!recipientId || !isAmountValid}
          label={t('Mint')}
          onStart={onClose}
          params={[id, recipientId, amount]}
          tx={api.tx.assets.mint}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Mint);
