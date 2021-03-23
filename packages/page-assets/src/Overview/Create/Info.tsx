// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { AssetId } from '@polkadot/types/interfaces';
import type { InfoState } from './types';

import React, { useEffect, useMemo, useState } from 'react';

import { InputAddress, InputNumber, Modal } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  assetIds: AssetId[];
  className?: string;
  isVisible: boolean;
  onChange: (info: InfoState | null) => void;
}

function Info ({ assetIds, className = '', isVisible, onChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [assetId, setAssetId] = useState<BN | null>(null);

  const isIdValid = useMemo(
    () => !!assetId && assetId.gt(BN_ZERO) && !assetIds.some((a) => a.eq(assetId)),
    [assetId, assetIds]
  );

  useEffect((): void => {
    onChange(
      assetId && accountId && isIdValid
        ? {
          accountId,
          assetId,
          infoTx: api.tx.assets.create(assetId, accountId, 0)
        }
        : null
    );
  }, [api, accountId, assetId, assetIds, isIdValid, onChange]);

  return (
    <div className={`${className}${isVisible ? '' : ' stepHidden'}`}>
      <Modal.Columns hint={t<string>('The account that is to be used to create this asset and setup the initial metadata.')}>
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
      </Modal.Columns>
    </div>
  );
}

export default React.memo(Info);
