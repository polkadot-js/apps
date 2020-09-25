// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubmittableExtrinsic } from '@polkadot/api/types';

import BN from 'bn.js';
import React, { useCallback, useMemo, useState } from 'react';
import { Button, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import TipCreate from './TipCreate';
import Tips from './Tips';

interface Props {
  className?: string;
  hashes?: string[] | null;
  isMember: boolean;
  members: string[];
  trigger: () => void;
}

interface QuickTipsState {
  quickTips: Record<string, BN | null>;
  quickTx: SubmittableExtrinsic<'promise'> | null;
}

function TipsEntry ({ className, hashes, isMember, members, trigger }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAccounts } = useAccounts();
  const { api } = useApi();
  const [{ quickTx }, setQuickTips] = useState<QuickTipsState>({ quickTips: {}, quickTx: null });

  const defaultId = useMemo(
    () => members.find((memberId) => allAccounts.includes(memberId)) || null,
    [allAccounts, members]
  );

  const _selectTip = useCallback(
    (hash: string, isSelected: boolean, value: BN) => setQuickTips(({ quickTips }): QuickTipsState => {
      quickTips[hash] = isSelected ? value : null;

      const available = Object
        .entries(quickTips)
        .map(([hash, value]) => value ? api.tx.treasury.tip(hash, value) : null)
        .filter((value): value is SubmittableExtrinsic<'promise'> => !!value);

      return {
        quickTips,
        quickTx: available.length
          ? available.length === 1
            ? available[0]
            : api.tx.utility.batch(available)
          : null
      };
    }),
    [api]
  );

  return (
    <div className={className}>
      <Button.Group>
        <TipCreate
          members={members}
          refresh={trigger}
        />
        <TxButton
          accountId={defaultId}
          extrinsic={quickTx}
          icon='fighter-jet'
          isDisabled={!isMember || !quickTx}
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
