// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSessionProgress } from '@polkadot/api-derive/types';
import type { SlashEra } from './types.js';

import React, { useMemo } from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN, BN_ONE, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  slash: SlashEra;
}

function Summary ({ slash: { era, nominators, reporters, total, validators } }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const sessionInfo = useCall<DeriveSessionProgress>(api.derive.session?.progress);

  const [blockProgress, blockEnd] = useMemo(
    () => sessionInfo
      ? [
        sessionInfo.activeEra.sub(era).isub(BN_ONE).imul(sessionInfo.eraLength).iadd(sessionInfo.eraProgress),
        api.consts.staking.slashDeferDuration.mul(sessionInfo.eraLength)
      ]
      : [new BN(0), new BN(0)],
    [api, era, sessionInfo]
  );

  return (
    <SummaryBox>
      <section>
        <CardSummary label={t('validators')}>
          {formatNumber(validators.length)}
        </CardSummary>
        <CardSummary label={t('nominators')}>
          {formatNumber(nominators.length)}
        </CardSummary>
        <CardSummary label={t('reporters')}>
          {formatNumber(reporters.length)}
        </CardSummary>
      </section>
      {blockProgress.gtn(0) && (
        <CardSummary
          label={t('defer')}
          progress={{
            total: blockEnd,
            value: blockProgress,
            withTime: true
          }}
        />
      )}
      <CardSummary label={t('total')}>
        <FormatBalance value={total} />
      </CardSummary>
    </SummaryBox>
  );
}

export default React.memo(Summary);
