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
  defaultValue: MetadataState | null;
  onChange: (info: MetadataState | null) => void;
}

function Metadata ({ assetId, className = '', defaultValue, onChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [initial] = useState(() => defaultValue);
  const [assetDecimals, setAssetDecimals] = useState<BN | null>(null);
  const [assetName, setAssetName] = useState<string | null | undefined>(() => defaultValue?.assetName);
  const [assetSymbol, setAssetSymbol] = useState<string | null | undefined>(() => defaultValue?.assetSymbol);

  const isValidDecimals = useMemo(
    () => !!assetDecimals && assetDecimals.lten(20),
    [assetDecimals]
  );

  const isValidName = useMemo(
    () => !!assetName && assetName.length >= 3 && assetName.length <= 32,
    [assetName]
  );

  const isValidSymbol = useMemo(
    () => !!assetSymbol && assetSymbol.length >= 3,
    [assetSymbol]
  );

  useEffect((): void => {
    onChange(
      assetId && assetName && assetSymbol && assetDecimals && isValidName && isValidSymbol && isValidDecimals
        ? { assetDecimals, assetName, assetSymbol, metadataTx: api.tx.assets.setMetadata(assetId, assetName, assetSymbol, assetDecimals) }
        : null
    );
  }, [api, assetDecimals, assetId, assetName, assetSymbol, isValidName, isValidSymbol, isValidDecimals, onChange]);

  return (
    <Modal.Content className={className}>
      <Modal.Columns hint={t<string>('The descriptive name for this asset.')}>
        <Input
          autoFocus
          defaultValue={initial?.assetName}
          isError={!isValidName}
          label={t<string>('asset name')}
          onChange={setAssetName}
        />
      </Modal.Columns>
      <Modal.Columns hint={t<string>('The symbol that will represent this asset.')}>
        <Input
          defaultValue={initial?.assetSymbol}
          isError={!isValidSymbol}
          label={t<string>('asset symbol')}
          onChange={setAssetSymbol}
        />
      </Modal.Columns>
      <Modal.Columns hint={t<string>('The number of decimals for this token. Max allowed via the UI is set to 20.')}>
        <InputNumber
          defaultValue={initial?.assetDecimals}
          isError={!isValidDecimals}
          label={t<string>('asset decimals')}
          onChange={setAssetDecimals}
        />
      </Modal.Columns>
    </Modal.Content>
  );
}

export default React.memo(Metadata);
