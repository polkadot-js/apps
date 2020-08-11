// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSessionProgress } from '@polkadot/api-derive/types';
import { SlashEra } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  slash: SlashEra;
}

function calcBlocks (slashDeferDuration: BN, era: BN, { activeEra, eraLength, eraProgress }: DeriveSessionProgress): [BN, BN] {
  return [
    activeEra.sub(era).subn(1).mul(eraLength).add(eraProgress),
    slashDeferDuration.mul(eraLength)
  ];
}

function Header ({ slash: { era, nominators, reporters, total, validators } }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const sessionInfo = useCall<DeriveSessionProgress>(api.derive.session?.progress, []);
  const [[blockProgress, blockEnd], setBlocks] = useState([new BN(0), new BN(0)]);

  useEffect((): void => {
    sessionInfo && setBlocks(
      calcBlocks(api.consts.staking.slashDeferDuration, era, sessionInfo)
    );
  }, [api, era, sessionInfo]);

  return (
    <tr>
      <td colSpan={8}>
        <SummaryBox isSmall>
          <section>
            <CardSummary label={t<string>('validators')}>
              {formatNumber(validators.length)}
            </CardSummary>
            <CardSummary label={t<string>('nominators')}>
              {formatNumber(nominators.length)}
            </CardSummary>
            <CardSummary label={t<string>('reporters')}>
              {formatNumber(reporters.length)}
            </CardSummary>
          </section>
          {blockProgress.gtn(0) && (
            <section>
              <CardSummary
                label={t<string>('defer')}
                progress={{
                  total: blockEnd,
                  value: blockProgress,
                  withTime: true
                }}
              />
            </section>
          )}
          <section>
            <CardSummary label={t<string>('total')}>
              <FormatBalance value={total} />
            </CardSummary>
          </section>
        </SummaryBox>
      </td>
    </tr>
  );
}

export default React.memo(Header);
