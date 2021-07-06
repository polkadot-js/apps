// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { AssetId } from '@polkadot/types/interfaces';
import type { InfoState } from './types';

import React, { useEffect, useMemo, useState } from 'react';

import { InputAddress, InputNumber, Modal } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BN_ONE, BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  assetIds: AssetId[];
  className?: string;
  defaultValue: InfoState | null;
  onChange: (info: InfoState | null) => void;
}

function findAvailbleId (assetIds: AssetId[]): BN {
  return assetIds.length
    ? assetIds[assetIds.length - 1].add(BN_ONE)
    : BN_ONE;
}

function Info ({ assetIds, className = '', defaultValue, onChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [initial] = useState(() => defaultValue);
  const [initialId] = useState(() => findAvailbleId(assetIds));
  const [accountId, setAccountId] = useState<string | null>(null);
  const [assetId, setAssetId] = useState<BN | null>(null);
  const [minBalance, setMinBalance] = useState<BN | null>(null);

  const isIdValid = useMemo(
    () => !!assetId && assetId.gt(BN_ZERO) && !assetIds.some((a) => a.eq(assetId)),
    [assetId, assetIds]
  );

  useEffect((): void => {
    onChange(
      assetId && accountId && minBalance && isIdValid && !minBalance.isZero()
        ? { accountId, assetId, createTx: api.tx.assets.create(assetId, accountId, minBalance), minBalance }
        : null
    );
  }, [api, accountId, assetId, assetIds, isIdValid, minBalance, onChange]);

  return (
    <Modal.Content className={className}>
      <Modal.Columns hint={t<string>('The account that is to be used to create this asset and setup the initial metadata.')}>
        <InputAddress
          defaultValue={initial?.accountId}
          label={t<string>('creator account')}
          onChange={setAccountId}
          type='account'
        />
      </Modal.Columns>
      <Modal.Columns hint={t<string>('The selected id for the asset. This should not match an already-existing asset id.')}>
        <InputNumber
          autoFocus
          defaultValue={initial?.assetId || initialId}
          isError={!isIdValid}
          isZeroable={false}
          label={t<string>('asset id')}
          onChange={setAssetId}
        />
      </Modal.Columns>
      <Modal.Columns hint={t<string>('The minimum balance for the asset.')}>
        <InputNumber
          defaultValue={initial?.minBalance || BN_ONE}
          isZeroable={false}
          label={t<string>('minimum balance')}
          onChange={setMinBalance}
        />
      </Modal.Columns>
    </Modal.Content>
  );
}

export default React.memo(Info);
