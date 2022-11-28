// Copyright 2017-2022 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { BN } from '@polkadot/util';

import React, { useCallback, useMemo, useState } from 'react';

import { Button, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useTxBatch } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import TipCreate from './TipCreate';
import Tips from './Tips';

interface Props {
  className?: string;
  hashes?: string[] | null;
  isMember: boolean;
  members: string[];
}

interface QuickTipsState {
  quickTips: Record<string, BN | null>;
  quickTxs: SubmittableExtrinsic<'promise'>[];
}

const DEFAULT_TIPS = { quickTips: {}, quickTxs: [] };

function TipsEntry ({ className, hashes, isMember, members }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAccounts } = useAccounts();
  const { api } = useApi();
  const [{ quickTxs }, setQuickTips] = useState<QuickTipsState>(DEFAULT_TIPS);
  const batchTxs = useTxBatch(quickTxs);

  const defaultId = useMemo(
    () => members.find((memberId) => allAccounts.includes(memberId)) || null,
    [allAccounts, members]
  );

  const _selectTip = useCallback(
    (hash: string, isSelected: boolean, value: BN) => setQuickTips(({ quickTips }): QuickTipsState => {
      quickTips[hash] = isSelected ? value : null;

      return {
        quickTips,
        quickTxs: Object
          .entries(quickTips)
          .map(([hash, value]) => value && (api.tx.tips || api.tx.treasury).tip(hash, value))
          .filter((value): value is SubmittableExtrinsic<'promise'> => !!value)
      };
    }),
    [api]
  );

  return (
    <div className={className}>
      <Button.Group>
        <TipCreate members={members} />
        <TxButton
          accountId={defaultId}
          extrinsic={batchTxs}
          icon='fighter-jet'
          isDisabled={!isMember || !batchTxs}
          label={t<string>('Median tip selected')}
        />
      </Button.Group>
      <Tips
        defaultId={defaultId}
        hashes={hashes}
        isMember={isMember}
        members={members}
        onSelectTip={_selectTip}
      />
    </div>
  );
}

export default React.memo(TipsEntry);
