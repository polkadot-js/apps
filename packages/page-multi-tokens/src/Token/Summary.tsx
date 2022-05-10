// Copyright 2017-2022 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';

import { BN } from '@polkadot/util';
import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import useTokenData from '../useTokenData';
import useAttributeData from '../useAttributeData';
import useAttributeKeys from '../useAttributeKeys';

interface Props {
  collectionId: BN;
  tokenId: BN;
}

function Summary({ collectionId, tokenId }: Props): React.ReactElement {
  const { t } = useTranslation();
  const data = useTokenData(collectionId, tokenId);
  const attributeKeys = useAttributeKeys(collectionId, tokenId);

  const nameAttrKey = useMemo(() => attributeKeys.find((k) => k.toHuman() == 'name'), [attributeKeys]);
  const nameAttrData = useAttributeData(collectionId, nameAttrKey, tokenId);

  return (
    <>
      <SummaryBox>
        <section>
          <CardSummary label={t<string>('collection')}>{formatNumber(collectionId)}</CardSummary>
          <CardSummary label={t<string>('token')}>{formatNumber(tokenId)}</CardSummary>
        </section>
        <section>
          <CardSummary label={t<string>('mint deposit')}>{formatNumber(data?.mintDeposit)}</CardSummary>
          <CardSummary label={t<string>('attributes')}>{formatNumber(data?.attributeCount)}</CardSummary>
        </section>
      </SummaryBox>

      <SummaryBox>
        <section>
          <CardSummary label={t<string>('name')}>{nameAttrData?.value.toHuman() || '-'}</CardSummary>
          <CardSummary className='media--800' label={t<string>('supply')}>
            {formatNumber(data?.supply)}
          </CardSummary>
        </section>
        <section>
          <CardSummary label={t<string>('minimum balance')}>{formatNumber(data?.minimumBalance)}</CardSummary>
          <CardSummary label={t<string>('cap')}>{JSON.stringify(data?.cap)?.replace(/[{}]/g, '')}</CardSummary>
        </section>
      </SummaryBox>

      <SummaryBox>
        <section></section>
        <section>
          <CardSummary label={t<string>('is frozen')}>{data?.isFrozen.toString()}</CardSummary>
          <CardSummary label={t<string>('unit price')}>{formatNumber(data?.unitPrice)}</CardSummary>
        </section>
      </SummaryBox>
    </>
  );
}

export default React.memo(Summary);
