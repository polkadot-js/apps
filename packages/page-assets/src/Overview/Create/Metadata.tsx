// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { MetadataState } from './types';

import React, { useEffect, useMemo, useState } from 'react';

import { Input, InputNumber, Modal } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';

interface Props {
  assetId?: BN | null;
  className?: string;
  onChange: (info: MetadataState | null) => void;
}

function Metadata ({ assetId, className = '', onChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [assetDecimals, setAssetDecimals] = useState<BN | null>(null);
  const [assetName, setAssetName] = useState<string | null>(null);
  const [assetSymbol, setAssetSymbol] = useState<string | null>(null);

  const isValidName = useMemo(
    () => !!assetName && assetName.length >= 3 && assetName.length <= 32,
    [assetName]
  );

  const isValidSymbol = useMemo(
    () => !!assetSymbol && assetSymbol.length >= 3,
    [assetSymbol]
  );

  const isValidDecimals = useMemo(
    () => !!assetDecimals && assetDecimals.lten(20),
    [assetDecimals]
  );

  useEffect((): void => {
    onChange(
      assetId && assetName && assetSymbol && assetDecimals && isValidName && isValidSymbol && isValidDecimals
        ? { metadataTx: api.tx.assets.setMetadata(assetId, assetName, assetSymbol, assetDecimals) }
        : null
    );
  }, [api, assetDecimals, assetId, assetName, assetSymbol, isValidName, isValidSymbol, isValidDecimals, onChange]);

  return (
    <Modal.Content className={className}>
      {/* <Modal.Columns hint={t<string>('The account that is to be used to create this asset and setup the initial metadata.')}>
        <InputAddress
          label={t<string>('admin account')}
          onChange={setAccountId}
          type='account'
        />
      </Modal.Columns>
      <Modal.Columns hint={t<string>('The selected id for the asset. Should not match an already-existing id.')}>
        <InputNumber
          isError={!isIdValid}
          isZeroable={false}
          label={t<string>('asset id')}
          onChange={setAssetId}
        />
      </Modal.Columns> */}
    </Modal.Content>
  );
}

export default React.memo(Metadata);
