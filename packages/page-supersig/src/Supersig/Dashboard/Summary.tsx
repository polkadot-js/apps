// Copyright 2017-2022 @decentration/page-supersig authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import '../../augment-supersig.ts';
import { useTranslation } from '@polkadot/app-treasury/translate';
import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { useCall, useApi } from '@polkadot/react-hooks';

type SortedAddress = { address: string; isFavorite: boolean };

interface Props {
  sigCnt: SortedAddress[] | undefined;
  totalProposals: number;
  totalBalance: string;
}

function Summary ({ sigCnt, totalProposals, totalBalance }: Props) {
  const { t } = useTranslation();
  
  return (

    <div style={{display: "flex", marginBottom: "30px"}}>
          {
            sigCnt &&
              <CardSummary label={t<string>('Total Supersigs')}>
                <p>{sigCnt.length}</p>
              </CardSummary>
          }
          <CardSummary label={t<string>('Live Proposals')}>
            <p>{totalProposals}</p>
          </CardSummary>
          <CardSummary label={t<string>('Total Funds')}>
            <FormatBalance
              className='result'
              value={totalBalance}
            />
          </CardSummary>
    </div>
  );
}

export default React.memo(Summary);
